import React, {useEffect} from 'react'
import { observer } from 'mobx-react-lite'
import { Link } from 'react-router-dom'
import classnames from 'classnames'

import { state } from '../../models'
import { TransactionTypeList} from '../../models/transaction.model'

import add from 'static/icons/add.png'

import css from './transaction.module.css'

export const TransactionList = observer((): JSX.Element => {
  const { collection, loading, loaded } = state.transaction;

  useEffect(() => {
    if (!loaded && !loading) {
      state.transaction.fetchTransactions(1)
    }
  }, [loaded, loading]);

  return (
    <div>
      <div className={css.header}>
        <h2>Transactions</h2>
        <Link to={'/dashboard/transaction/create'}>
          <img src={add} alt="Add transaction" className={css.icon} />
        </Link>
      </div>
      <div className={css.content}>
        {loaded && collection.length === 0 && (
          <div className={css.info}>No transactions was found...</div>
        )}
        {loading && (collection.length === 0) && <div className={css.info}>Loading transactions...</div>}
        {collection.map((transaction) => (
          <Link
            to={`/dashboard/transaction/edit/${transaction.id}`}
            key={transaction.id}
            className={classnames(css.transaction, {
              [css.income]: transaction.type === TransactionTypeList.Income,
              [css.outcome]: transaction.type === TransactionTypeList.Outcome,
              [css.transfer]: transaction.to !== null,
            })}
          >
            <div className={css.payment}>
              {transaction.from?.name} {transaction.to ? `→ ${transaction.to.name}` : ''}
              <span>{(new Date(transaction.date!)).toDateString()}</span>
            </div>
            <div className={css.cost}>
              {transaction.to !== null ? '=' : transaction.type === TransactionTypeList.Income ? '+' : '-'}
              {new Intl.NumberFormat().format(transaction.cost!)} RUB
            </div>
            <div className={css.category}>
              {transaction.category?.name} {transaction.category?.parent && `(${transaction.category?.parent.name})`}
            </div>
            <div className={css.comment}>
              {transaction.comment || 'No comment'}
            </div>
          </Link>
        ))}
        <Link to={'/dashboard/transaction/create'}>Add</Link>
      </div>
    </div>
  )
})
