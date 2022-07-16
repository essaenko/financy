import React, { useState } from 'react';
import { Route } from 'react-router-dom';

import { DashboardAccount } from 'modules/dashboard/dashboard.account';
import { DashboardContent } from 'modules/dashboard/dashboard.content';
import { Header } from 'modules/header/header';

import css from './dashboard.module.css';

export const Dashboard = (): JSX.Element => {
  const [isSidebarOpened, setIsSidebarOpened] = useState(false);

  return (
    <div className={css.root}>
      <Route path="/dashboard">
        <Header onOpenSidebar={() => setIsSidebarOpened(true)} />
        <DashboardAccount />
        <DashboardContent
          sidebarState={isSidebarOpened}
          onCloseSidebar={() => setIsSidebarOpened(false)}
        />
      </Route>
    </div>
  );
};
