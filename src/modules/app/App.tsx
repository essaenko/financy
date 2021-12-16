import React from 'react';

import { Auth } from 'modules/auth';

import css from './app.module.css';

export const App = (): JSX.Element => (
  <div className={css.root}>
    <Auth />
  </div>
);

