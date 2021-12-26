import React from 'react'
import { Route } from 'react-router-dom'
import { observer } from 'mobx-react-lite'

import { TransactionList } from 'modules/transaction/transaction.list'
import { TransactionCreate } from 'modules/transaction/transaction.create'
import { TransactionEdit } from 'modules/transaction/transaction.edit'

import css from './transaction.module.css'

export const Transaction = observer((): JSX.Element => {
  return (
    <div className={css.root}>
      <Route path={'/dashboard/transaction'} exact>
        <TransactionList />
      </Route>
      <Route path={'/dashboard/transaction/create'}>
        <TransactionCreate />
      </Route>
      <Route path={'/dashboard/transaction/edit/:id'} exact>
        <TransactionEdit />
      </Route>
    </div>
  )
})
