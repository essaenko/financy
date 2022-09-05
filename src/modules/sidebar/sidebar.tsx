import React from 'react';
import { NavLink } from 'react-router-dom';

import classnames from 'classnames';
import css from './sidebar.module.css';

export const Sidebar = (): JSX.Element => {
  return (
    <div className={classnames(css.root)}>
      <NavLink
        to="/dashboard/transaction"
        className={css.link}
        activeClassName={css.activeLink}
      >
        <span>Операции</span>
      </NavLink>
      <NavLink
        to="/dashboard/stats"
        className={css.link}
        activeClassName={css.activeLink}
      >
        <span>Статистика</span>
      </NavLink>
      <NavLink
        to="/dashboard/payment"
        className={css.link}
        activeClassName={css.activeLink}
      >
        <span>Счета</span>
      </NavLink>
      <NavLink
        to="/dashboard/category"
        className={css.link}
        activeClassName={css.activeLink}
      >
        <span>Категории</span>
      </NavLink>
      <NavLink
        to="/dashboard/account"
        className={css.link}
        activeClassName={css.activeLink}
      >
        <span>Аккаунт</span>
      </NavLink>
      <NavLink
        to="/dashboard/transaction/import"
        className={css.link}
        activeClassName={css.activeLink}
      >
        <span>Импорт</span>
      </NavLink>
      <a className={css.footerLink} href="mailto:support@financy.live">
        Поддержка
      </a>
      <span className={css.footerItem}>Financy © 2022</span>
    </div>
  );
};
