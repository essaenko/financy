import React from 'react'
import { Route } from 'react-router-dom'

import { DashboardAccount } from 'modules/dashboard/dashboard.account'

import css from './dashboard.module.css'

export const Dashboard = (): JSX.Element => {
  return (
    <div className={css.root}>
      <Route path={'/dashboard'}>
        <DashboardAccount />
      </Route>
    </div>
  )
}
