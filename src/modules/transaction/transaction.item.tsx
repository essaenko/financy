import React, { useCallback, useMemo } from 'react';
import classnames from 'classnames';
import { useHistory } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import {
  TransactionState,
  TransactionTypeList,
} from 'models/transaction.model';

import css from 'modules/transaction/transaction.module.css';

type PropsType = {
  transaction: TransactionState;
};

export const TransactionItem = observer(({ transaction }: PropsType) => {
  const history = useHistory();
  const tDate = useMemo(
    () => new Date(transaction?.date || ''),
    [transaction?.date],
  );
  const onNavigate = useCallback(() => {
    history.push({
      pathname: `/dashboard/transaction/edit/${transaction.id}`,
      search: history.location.search,
    });
  }, [history, transaction.id]);

  return window.innerWidth > 425 ? (
    <tr
      key={transaction.id}
      className={classnames(css.transaction, {
        [css.income]: transaction.type === TransactionTypeList.Income,
        [css.outcome]: transaction.type === TransactionTypeList.Outcome,
        [css.transfer]: transaction.to !== null,
      })}
      onClick={onNavigate}
    >
      <td>
        <span>
          {new Date(tDate || '').toLocaleDateString(navigator.language, {
            day: '2-digit',
            month: '2-digit',
            year:
              tDate.getFullYear() < new Date().getFullYear()
                ? 'numeric'
                : undefined,
          })}
        </span>
      </td>
      <td>
        <div className={css.cost}>
          {transaction.to !== null && '='}
          {transaction.to === null &&
          transaction.type === TransactionTypeList.Income
            ? '+'
            : '-'}
          {new Intl.NumberFormat().format(transaction.cost || 0)} ₽
        </div>
      </td>
      <td>
        <div className={css.payment}>
          {transaction.from?.name} ({transaction.from?.account?.name}){' '}
          {transaction.to
            ? `→ ${transaction.to.name} (${transaction.to.account?.name}) ${transaction.to.owner?.name}`
            : ''}
        </div>
      </td>
      <td>
        <div>
          {transaction.category?.name}{' '}
          {transaction.category?.parent &&
            `(${transaction.category?.parent.name})`}
        </div>
      </td>
      <td>
        <div className={css.comment}>
          {transaction.comment || 'Нет коментария'}
        </div>
      </td>
      <td>
        <span>{transaction.user?.name}</span>
      </td>
    </tr>
  ) : (
    <div
      key={transaction.id}
      className={classnames(css.transaction, {
        [css.income]: transaction.type === TransactionTypeList.Income,
        [css.outcome]: transaction.type === TransactionTypeList.Outcome,
        [css.transfer]: transaction.to !== null,
      })}
      onClick={onNavigate}
    >
      <div>
        <div className={css.payment}>
          {transaction.from?.name} ({transaction.from?.account?.name}){' '}
          {transaction.to
            ? `→ ${transaction.to.name} (${transaction.to.account?.name}) ${transaction.to.owner?.name}`
            : ''}
          <span>
            {new Date(tDate || '').toLocaleDateString(navigator.language, {
              day: '2-digit',
              month: '2-digit',
              year:
                tDate.getFullYear() < new Date().getFullYear()
                  ? 'numeric'
                  : undefined,
            })}
          </span>
        </div>
      </div>
      <div>
        <div className={css.cost}>
          {transaction.to !== null && '='}
          {transaction.to === null &&
          transaction.type === TransactionTypeList.Income
            ? '+'
            : '-'}
          {new Intl.NumberFormat().format(transaction.cost || 0)} ₽
        </div>
        <div>
          {transaction.category?.name}{' '}
          {transaction.category?.parent &&
            `(${transaction.category?.parent.name})`}
        </div>
        <div className={css.comment}>
          {transaction.comment || 'Нет коментария'}
          <span>{transaction.user?.name}</span>
        </div>
      </div>
    </div>
  );
});
