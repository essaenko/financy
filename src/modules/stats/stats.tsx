import React, {
  ChangeEvent,
  Dispatch,
  MouseEvent,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { observer } from 'mobx-react-lite';
import { add, endOfMonth, getDayOfYear, startOfMonth } from 'date-fns';

import { StyledLineChart, StyledPieChart } from 'modules/stats/stats.charts';

import { dateToString } from 'utils/date.utils';
import { TransactionTypeList } from '../../models/transaction.model';
import { state } from '../../models';

import { NetworkComponentStatusList } from '../../api/api.handler';

import css from './stats.module.css';
import { CategoryModel, CategoryTypeList } from '../../models/category.model';

export const Stats = observer((): JSX.Element => {
  const { collection: categories } = state.categories;
  const { users } = state.account;
  const { status: categoriesStatus } = state.categories;
  const {
    status: statsStatus,
    income,
    outcome,
    remains,
    structure,
  } = state.stats;
  const { collection: payments, status: paymentsStatus } = state.payment;
  const [type, setType] = useState<TransactionTypeList>(
    TransactionTypeList.All,
  );
  const [category, setCategory] = useState<number>(0);
  const [user, setUser] = useState<number>(0);
  const [dateFrom, setDateFrom] = useState<Date>(startOfMonth(new Date()));
  const [dateTo, setDateTo] = useState<Date>(endOfMonth(new Date()));
  const [tickDateFormat, setTickDateFormat] = useState<string>('d LLL');
  const incomeData = useMemo(
    () =>
      income.map(state => ({
        date: state.date,
        value: state.value,
      })),
    [income],
  );
  const outcomeData = useMemo(
    () =>
      outcome.map(state => ({
        date: state.date,
        value: state.value,
      })),
    [outcome],
  );
  const remainsKeys = useMemo(() => {
    const keys: Record<number, string> = {};

    remains.forEach(it => {
      if (it.key) {
        const payment = payments.find(({ id }) => it.key);

        keys[it.key] = payment?.name ?? 'Unresolved payment method';
      }
    });

    return keys;
  }, [payments, remains]);
  const remainsData = useMemo(
    () =>
      remains.map(it => ({
        date: it.date,
        [remainsKeys[it.key as number]]: it.value,
      })),
    [remains, remainsKeys],
  );

  const structureData = useMemo(() => {
    const result: Record<CategoryTypeList, { name: string; value: number }[]> =
      {
        [CategoryTypeList.Income]: [],
        [CategoryTypeList.Outcome]: [],
        [CategoryTypeList.All]: [],
      };

    if (Object.keys(structure).length) {
      categories
        ?.filter(it => it.type === CategoryTypeList.Income)
        .forEach(it => {
          if (!structure[it.id as number]) {
            return;
          }

          const category: CategoryModel = it.parent ? it.parent : it;

          const batch = result[CategoryTypeList.Income].find(
            ({ name }) => name === category.name,
          );

          if (batch) {
            batch.value += structure[it.id as number];
          } else {
            result[CategoryTypeList.Income].push({
              name: category.name as string,
              value: structure[it.id as number],
            });
          }
        });

      categories
        ?.filter(it => it.type === CategoryTypeList.Outcome)
        .forEach(it => {
          if (!structure[it.id as number]) {
            return;
          }

          const category: CategoryModel = it.parent ? it.parent : it;

          const batch = result[CategoryTypeList.Outcome].find(
            ({ name }) => name === category.name,
          );

          if (batch) {
            batch.value += structure[it.id as number];
          } else {
            result[CategoryTypeList.Outcome].push({
              name: category.name as string,
              value: structure[it.id as number],
            });
          }
        });
    }

    return result;
  }, [categories, structure]);

  const halfChartWidth = useMemo(() => {
    return window.innerWidth > 414
      ? (window.innerWidth - 320) / 2
      : (window.innerWidth - 30) / 2;
  }, []);
  const fullChartWidth = useMemo(() => {
    return window.innerWidth > 414 ? window.innerWidth - 320 : 800;
  }, []);

  useEffect(() => {
    if (categoriesStatus === NetworkComponentStatusList.Untouched) {
      state.categories.fetchCategories();
    }
  }, [categoriesStatus]);

  useEffect(() => {
    if (statsStatus === NetworkComponentStatusList.Untouched) {
      state.stats.fetchStatsData(dateFrom, dateTo, type, category, user);
    }
  }, [category, dateFrom, dateTo, statsStatus, type, user]);

  useEffect(() => {
    if (paymentsStatus === NetworkComponentStatusList.Untouched) {
      state.payment.fetchPaymentMethods();
    }
  }, [paymentsStatus]);

  useEffect(() => {
    const dateDiff = getDayOfYear(dateTo) - getDayOfYear(dateFrom);

    if (dateDiff < 32) {
      setTickDateFormat('d LLL');
    } else if (dateDiff > 182) {
      setTickDateFormat('LLL');
    }
  }, [dateFrom, dateTo]);
  const onSelectChangeFactory =
    <T extends unknown>(setter: Dispatch<T>) =>
    (event: ChangeEvent<HTMLSelectElement>) => {
      setter(event.currentTarget.value as T);
    };

  const onSubmit = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (statsStatus !== NetworkComponentStatusList.Loading) {
      state.stats.fetchStatsData(dateFrom, dateTo, type, category, user);
    }
  };

  return (
    <div className={css.root}>
      <div className={css.header}>
        <h2>Statistic</h2>
      </div>
      <div className={css.content}>
        <div className={css.filters}>
          <form>
            <input
              type="date"
              defaultValue={dateToString(dateFrom)}
              max={dateToString(add(new Date(dateTo), { days: -1 }))}
              onChange={event =>
                setDateFrom(new Date(event.currentTarget.value))
              }
            />{' '}
            -
            <input
              type="date"
              defaultValue={dateToString(dateTo)}
              min={dateToString(add(new Date(dateFrom), { days: 1 }))}
              onChange={event => setDateTo(new Date(event.currentTarget.value))}
            />
            <select value={type} onChange={onSelectChangeFactory(setType)}>
              <option value={TransactionTypeList.All}>By type (none)</option>
              <option value={TransactionTypeList.Income}>
                {TransactionTypeList.Income}
              </option>
              <option value={TransactionTypeList.Outcome}>
                {TransactionTypeList.Outcome}
              </option>
            </select>
            <select
              value={category}
              onChange={onSelectChangeFactory(setCategory)}
              disabled={type === TransactionTypeList.All}
            >
              <option value={0}>By category (none)</option>
              {categories
                .filter(
                  category =>
                    type === TransactionTypeList.All ||
                    category.type === type.valueOf(),
                )
                .map(category => (
                  <option value={category.id} key={category.id}>
                    {category.name}
                    {category.parent?.id && ` (${category.parent.name})`}
                  </option>
                ))}
            </select>
            <select value={user} onChange={onSelectChangeFactory(setUser)}>
              <option value={0}>By user (none)</option>
              {users.map(user => (
                <option value={user.id} key={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
            <button onClick={onSubmit}>Update</button>
          </form>
        </div>
        <div className={css.status}>
          {statsStatus === NetworkComponentStatusList.Failed && (
            <span className={css.error}>
              Network problems occurred. Please try again.
            </span>
          )}
          {statsStatus === NetworkComponentStatusList.Loaded &&
            income.length === 0 &&
            outcome.length === 0 && (
              <span className={css.info}>
                There is no statistics data for current parameters. Try to
                change filters or type other date range.
              </span>
            )}
        </div>
        <div>
          <h3>Structure</h3>
          <div className={css.graphs}>
            <div>
              <h4>
                Income:{' '}
                {new Intl.NumberFormat().format(
                  structureData.Income.reduce((acc, it) => {
                    acc += it.value;

                    return acc;
                  }, 0),
                )}{' '}
                rub
              </h4>
              <StyledPieChart
                width={halfChartWidth}
                height={400}
                data={structureData.Income}
              />
            </div>
            <div>
              <h4>
                Outcome:{' '}
                {new Intl.NumberFormat().format(
                  structureData.Outcome.reduce((acc, it) => {
                    acc += it.value;

                    return acc;
                  }, 0),
                )}{' '}
                rub
              </h4>
              <StyledPieChart
                width={halfChartWidth}
                height={400}
                data={structureData.Outcome}
              />
            </div>
          </div>
        </div>
        <div className={css.graphs}>
          <div>
            <h3>Income</h3>
            <div className={css.chartWrapper}>
              <StyledLineChart
                dataKeys={['value']}
                width={
                  window.innerWidth > 414 ? halfChartWidth : fullChartWidth
                }
                data={incomeData}
                dateFormat={tickDateFormat}
              />
            </div>
          </div>
          <div>
            <h3>Outcome</h3>
            <div className={css.chartWrapper}>
              <StyledLineChart
                dataKeys={['value']}
                width={
                  window.innerWidth > 414 ? halfChartWidth : fullChartWidth
                }
                data={outcomeData}
                dateFormat={tickDateFormat}
              />
            </div>
          </div>
        </div>
        <div className={css.graphs}>
          <div>
            <h3>Dynamic</h3>
            <div className={css.chartWrapper}>
              <StyledLineChart
                dataKeys={['value']}
                width={fullChartWidth}
                data={
                  type === TransactionTypeList.All &&
                  income.length > 0 &&
                  outcome.length > 0
                    ? income.map((batch, index) => ({
                        date: batch.date,
                        value:
                          (batch.value ?? 0) - (outcome[index]?.value || 0),
                      }))
                    : []
                }
                dateFormat={tickDateFormat}
                tooltipTitle="Difference"
              />
            </div>
          </div>
        </div>
        <div className={css.graphs}>
          <div>
            <h3>Remains</h3>
            <div className={css.chartWrapper}>
              <StyledLineChart
                xDataKey="date"
                width={fullChartWidth}
                height={360}
                dateFormat="dd.MM.yy"
                data={remainsData}
                dataKeys={Object.values(remainsKeys)}
                showLegend
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
