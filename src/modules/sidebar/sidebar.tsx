import React from 'react';
import { NavLink } from 'react-router-dom';

import classnames from 'classnames';
import css from './sidebar.module.css';

type Props = {
  state: boolean;
  onClose: () => void;
};

export const Sidebar = ({ state, onClose }: Props): JSX.Element => {
  return (
    <div
      onClick={onClose}
      className={classnames(css.root, {
        [css.opened]: state,
      })}
    >
      <NavLink
        to="/dashboard/transaction"
        className={css.link}
        activeClassName={css.activeLink}
      >
        <span>Transactions</span>
      </NavLink>
      <NavLink
        to="/dashboard/stats"
        className={css.link}
        activeClassName={css.activeLink}
      >
        <span>Statistics</span>
      </NavLink>
      <NavLink
        to="/dashboard/payment"
        className={css.link}
        activeClassName={css.activeLink}
      >
        <span>Payment methods</span>
      </NavLink>
      <NavLink
        to="/dashboard/category"
        className={css.link}
        activeClassName={css.activeLink}
      >
        <span>Categories</span>
      </NavLink>
      <NavLink
        to="/dashboard/family"
        className={css.link}
        activeClassName={css.activeLink}
      >
        <span>Family</span>
      </NavLink>
    </div>
  );
};
