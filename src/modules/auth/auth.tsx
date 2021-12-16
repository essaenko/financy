import React from 'react';
import { Route } from "react-router-dom";

import { AuthLogin } from "modules/auth/auth.login";
import { AuthRegistration } from "modules/auth/auth.registration";

import css from './auth.module.css';

export const Auth = (): JSX.Element => {
  return (
    <div className={css.root}>
      <Route path={'/'} exact>
        <AuthLogin />
      </Route>
      <Route path={'/signup'} exact>
        <AuthRegistration />
      </Route>
    </div>
  )
}