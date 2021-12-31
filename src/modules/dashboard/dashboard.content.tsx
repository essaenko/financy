import React from 'react'
import { Route } from 'react-router-dom'

import { Sidebar } from 'modules/sidebar'
import { Account } from 'modules/account'
import { Category } from 'modules/category'
import { Payment } from 'modules/payment'
import { Transaction } from 'modules/transaction'
import { Stats } from 'modules/stats'

import css from './dashboard.module.css'

export const DashboardContent = (): JSX.Element => {
  return (
    <div className={css.content}>
      <Sidebar />
      <Route path={'/dashboard/family'}>
        <Account />
      </Route>
      <Route path={'/dashboard/category'}>
        <Category />
      </Route>
      <Route path={'/dashboard/payment'}>
        <Payment />
      </Route>
      <Route path={'/dashboard/stats'}>
        <Stats />
      </Route>
      <Route path={'/dashboard/transaction'}>
        <Transaction />
      </Route>
    </div>
  )
}
