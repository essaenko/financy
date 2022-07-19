import React from 'react';
import { observer } from 'mobx-react-lite';
import { Link, NavLink } from 'react-router-dom';

import { state } from 'models';
import { AUTH_TOKEN_LOCAL_STORAGE_KEY } from '../../globals.config';

import {
  CategoriesIcon,
  CreditCardIcon,
  ListIcon,
  LogoutIcon,
  PieChartIcon,
  UserIcon,
} from 'static/icons';

import css from './header.module.css';
import { IconStyleList } from 'static/icons/react.icon';

export const Header = observer((): JSX.Element => {
  const onLogout = () => {
    localStorage.removeItem(AUTH_TOKEN_LOCAL_STORAGE_KEY);

    window.location.href = `/`;
  };
  return (
    <div className={css.root}>
      <div className={css.desktop}>
        <Link to="/dashboard/transaction" className={css.logo}>
          Financy
        </Link>
        <span className={css.username}>
          <Link to="/dashboard/account">{state.user.name}</Link>
          <LogoutIcon
            onClick={onLogout}
            className={css.icon}
            style={IconStyleList.White}
          />
        </span>
      </div>
      <div className={css.mobile}>
        <NavLink activeClassName={css.activeLink} to="/dashboard/transaction">
          <ListIcon style={IconStyleList.White} />
        </NavLink>
        <NavLink activeClassName={css.activeLink} to="/dashboard/stats">
          <PieChartIcon style={IconStyleList.White} />
        </NavLink>
        <NavLink activeClassName={css.activeLink} to="/dashboard/payment">
          <CreditCardIcon style={IconStyleList.White} />
        </NavLink>
        <NavLink activeClassName={css.activeLink} to="/dashboard/category">
          <CategoriesIcon style={IconStyleList.White} />
        </NavLink>
        <NavLink activeClassName={css.activeLink} to="/dashboard/account">
          <UserIcon style={IconStyleList.White} />
        </NavLink>
      </div>
    </div>
  );
});
