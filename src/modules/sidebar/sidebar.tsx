import React from 'react'
import { NavLink } from 'react-router-dom'

import css from './sidebar.module.css'

export const Sidebar = (): JSX.Element => {
  return (
    <div className={css.root}>
      <NavLink
        to={'/dashboard/transaction'}
        className={css.link}
        activeClassName={css.activeLink}
      >
        <span>Transactions</span>
      </NavLink>
      <NavLink
        to={'/dashboard/stats'}
        className={css.link}
        activeClassName={css.activeLink}
      >
        <span>Statistics</span>
      </NavLink>
      <NavLink
        to={'/dashboard/payment'}
        className={css.link}
        activeClassName={css.activeLink}
      >
        <span>Payment methods</span>
      </NavLink>
      <NavLink
        to={'/dashboard/category'}
        className={css.link}
        activeClassName={css.activeLink}
      >
        <span>Categories</span>
      </NavLink>
      <NavLink
        to={'/dashboard/family'}
        className={css.link}
        activeClassName={css.activeLink}
      >
        <span>Family</span>
      </NavLink>
    </div>
  )
}
