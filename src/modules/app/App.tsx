import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import { Auth } from 'modules/auth';
import { Dashboard } from 'modules/dashboard';

import css from './app.module.css';

export const App = (): JSX.Element => {
  return (
    <div className={css.root}>
      <BrowserRouter>
        <Auth />
        <Dashboard />
      </BrowserRouter>
    </div>
  );
};
