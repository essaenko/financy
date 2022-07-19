import React, { useState } from 'react';
import { Route } from 'react-router-dom';

import { DashboardAccount } from 'modules/dashboard/dashboard.account';
import { DashboardContent } from 'modules/dashboard/dashboard.content';
import { Header } from 'modules/header/header';

import css from './dashboard.module.css';

export const Dashboard = (): JSX.Element => {
  return (
    <div className={css.root}>
      <Route path="/dashboard">
        <Header />
        <DashboardAccount />
        <DashboardContent />
      </Route>
    </div>
  );
};
