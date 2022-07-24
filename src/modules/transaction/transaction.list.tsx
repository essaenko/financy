import React, {
  MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { observer } from 'mobx-react-lite';
import { Link, useHistory } from 'react-router-dom';
import classnames from 'classnames';

import { TransactionItem } from 'modules/transaction/transaction.item';
import { DateIntervalList, TransactionFilters } from 'utils/class.utils';
import { Picker } from 'components';
import { NetworkComponentStatusList } from 'api/api.handler';
import { state } from 'models';
import { TransactionTypeList } from 'models/transaction.model';

import css from './transaction.module.css';
import { FilterIcon, PlusIcon } from 'static/icons';
import { TRANSACTIONS_PER_PAGE } from '../../globals.config';
import { useQuery } from 'utils/url.utils';
import { addDays, addMonths, addYears } from 'date-fns';

export const TransactionList = observer((): JSX.Element => {
  const history = useHistory();
  const query = useQuery();
  const today = useMemo(() => new Date(), []);
  const {
    transaction: { collection, status, total },
    account,
  } = state;
  const [type, setType] = useState<TransactionTypeList>(
    TransactionTypeList[
      query.get('type') as keyof typeof TransactionTypeList
    ] ?? TransactionTypeList.All,
  );
  const [dateInterval, setDateInterval] = useState<DateIntervalList>(
    DateIntervalList[query.get('interval') as keyof typeof DateIntervalList] ??
      DateIntervalList.Ever,
  );
  const [category, setCategory] = useState<number>(
    Number(query.get('category')) || 0,
  );
  const [dateFilter, setDateFilter] = useState<number | null>(
    Number(query.get('date')) || null,
  );
  const [page, setPage] = useState<number>(Number(query.get('page') || 1));
  const { collection: categories, status: categoriesStatus } = state.categories;
  const dateFilterValue = useMemo(() => {
    const date = new Date(dateFilter ?? Date.now());

    return date.toISOString().slice(0, 10);
  }, [dateFilter]);
  const [filterState, setFilterState] = useState<boolean>(false);
  const toggleFilter = useCallback(() => {
    setFilterState(!filterState);
  }, [filterState]);

  useEffect(() => {
    if (categoriesStatus === NetworkComponentStatusList.Untouched) {
      state.categories.fetchCategories();
    }
  }, [categoriesStatus]);

  useEffect(() => {
    let dateFrom: number;
    switch (dateInterval) {
      case DateIntervalList.Day:
        dateFrom = addDays(today, -1).getTime();
        break;
      case DateIntervalList.Month:
        dateFrom = addMonths(today, -1).getTime();
        break;
      case DateIntervalList.Year:
        dateFrom = addYears(today, -1).getTime();
        break;
      default:
        dateFrom = new Date(account.createdAt || '').getTime();
    }
    state.transaction.fetchTransactions(
      new TransactionFilters(
        page,
        void 0,
        type,
        category || void 0,
        dateFrom,
        today.getTime(),
        dateFilter ? +dateFilter : void 0,
      ),
    );
  }, [
    type,
    page,
    dateInterval,
    category,
    dateFilter,
    today,
    account.createdAt,
  ]);

  useEffect(() => {
    setPage(1);
  }, [type]);

  useEffect(() => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('type', type.toString());
    params.append('interval', dateInterval);
    params.append('category', category.toString());
    if (dateFilter) {
      params.append('date', dateFilter.toString());
    }
    history.push({
      search: params.toString(),
    });
  }, [history, page, type, dateInterval, category, dateFilter]);

  const clearFilters = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setCategory(0);
    setDateInterval(DateIntervalList.Ever);
    setDateFilter(null);
  }, []);

  return (
    <div>
      <div className={css.header}>
        <h2>Transactions</h2>
        <Picker
          className={css.picker}
          elements={[
            {
              id: TransactionTypeList.All,
              text: TransactionTypeList.All.toString(),
            },
            {
              id: TransactionTypeList.Income,
              text: TransactionTypeList.Income.toString(),
            },
            {
              id: TransactionTypeList.Outcome,
              text: TransactionTypeList.Outcome.toString(),
            },
          ]}
          active={type}
          onChange={id => () => setType(id as TransactionTypeList)}
        />
        <div className={css.buttons}>
          <Link
            to={{
              pathname: '/dashboard/transaction/create',
              search: history.location.search,
            }}
          >
            <PlusIcon className={css.icon} />
          </Link>
          <div
            className={classnames(css.filters, {
              [css.activeFilter]:
                dateInterval !== DateIntervalList.Ever ||
                category !== 0 ||
                dateFilter !== null,
              [css.open]: filterState,
            })}
          >
            <FilterIcon className={css.icon} onClick={toggleFilter} />
            <div className={css.hiddenContent}>
              <Picker
                className={css.dateIntervalPicker}
                elements={[
                  {
                    id: DateIntervalList.Ever,
                    text: DateIntervalList.Ever.toString(),
                  },
                  {
                    id: DateIntervalList.Day,
                    text: DateIntervalList.Day.toString(),
                  },
                  {
                    id: DateIntervalList.Month,
                    text: DateIntervalList.Month.toString(),
                  },
                  {
                    id: DateIntervalList.Year,
                    text: DateIntervalList.Year.toString(),
                  },
                ]}
                active={dateInterval}
                onChange={id => () => setDateInterval(id as DateIntervalList)}
              />
              <form>
                <select
                  value={category ?? 0}
                  onChange={event => setCategory(+event.currentTarget.value)}
                >
                  <option value={0} disabled key={0}>
                    Filter by category
                  </option>
                  {categories
                    .filter(
                      category =>
                        type === TransactionTypeList.All ||
                        category.type?.valueOf() === type.valueOf(),
                    )
                    .map(category => (
                      <option value={category.id} key={category.id}>
                        {category.name}
                        {category.parent && ` (${category.parent.name})`}
                      </option>
                    ))}
                </select>
                <input
                  type="date"
                  placeholder="From date"
                  onChange={event =>
                    setDateFilter(new Date(event.currentTarget.value).getTime())
                  }
                  value={dateFilterValue}
                />
                <button className="flat" onClick={clearFilters}>
                  Clear
                </button>
                <span onClick={() => setFilterState(false)}>Close</span>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className={css.content}>
        {page > 1 &&
          collection.length < page * TRANSACTIONS_PER_PAGE &&
          collection.length < total && <span>Show previous transactions</span>}
        {status === NetworkComponentStatusList.Loaded &&
          collection.length === 0 && (
            <div className={css.info}>No transactions was found...</div>
          )}
        {status === NetworkComponentStatusList.Loading &&
          !collection.length && (
            <div className={css.info}>Loading transactions...</div>
          )}
        {collection.map(transaction => (
          <TransactionItem key={transaction.id} transaction={transaction} />
        ))}
        {page < Math.ceil(total / TRANSACTIONS_PER_PAGE) && (
          <span className={css.moreButton} onClick={() => setPage(page + 1)}>
            Show more
          </span>
        )}
      </div>
    </div>
  );
});
