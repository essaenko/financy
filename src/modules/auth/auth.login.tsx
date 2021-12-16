import React from 'react';
import {Link} from "react-router-dom";

import css from './auth.module.css';

export const AuthLogin = (): JSX.Element => {
  return (
    <div className={css.login}>
      <form className={css.form}>
        <input type="email" placeholder={'Email'} className={css.field} />
        <input type="password" placeholder={'Password'} className={css.field} />
      </form>
      <Link to={'/signup'}>
        Registration
      </Link>
    </div>
  )
}