import React from 'react';
import classnames from 'classnames';
import { Link, useHistory } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import {
  TransactionState,
  TransactionTypeList,
} from '../../models/transaction.model';

import css from 'modules/transaction/transaction.module.css';

type PropsType = {
  transaction: TransactionState;
};

export const TransactionItem = observer(({ transaction }: PropsType) => {
  const history = useHistory();
  return (
    <Link
      to={{
        pathname: `/dashboard/transaction/edit/${transaction.id}`,
        search: history.location.search,
      }}
      key={transaction.id}
      className={classnames(css.transaction, {
        [css.income]: transaction.type === TransactionTypeList.Income,
        [css.outcome]: transaction.type === TransactionTypeList.Outcome,
        [css.transfer]: transaction.to !== null,
      })}
    >
      <div className={css.payment}>
        {transaction.from?.name}{' '}
        {transaction.to ? `→ ${transaction.to.name}` : ''}
        <span>{new Date(transaction?.date || '').toDateString()}</span>
      </div>
      <div className={css.cost}>
        {transaction.to !== null && '='}
        {transaction.to === null &&
        transaction.type === TransactionTypeList.Income
          ? '+'
          : '-'}
        {new Intl.NumberFormat().format(transaction.cost || 0)} RUB
      </div>
      <div className={css.category}>
        {transaction.category?.name}{' '}
        {transaction.category?.parent &&
          `(${transaction.category?.parent.name})`}
      </div>
      <div className={css.comment}>
        {transaction.comment || 'No comment'}
        <span>{transaction.user?.name}</span>
      </div>
    </Link>
  );
});
