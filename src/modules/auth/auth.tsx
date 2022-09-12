import React, { useEffect, useState } from 'react';
import { Route, useHistory } from 'react-router-dom';

import { AuthLogin } from 'modules/auth/auth.login';
import { AuthRegistration } from 'modules/auth/auth.registration';
import { AuthRestore } from 'modules/auth/auth.restore';
import { AuthReset } from 'modules/auth/auth.reset';

import { state } from '../../models';

import css from './auth.module.css';
import { useQuery } from 'utils/url.utils';
import { observer } from 'mobx-react-lite';

export const Auth = observer(() => {
  const history = useHistory();
  const query = useQuery();
  const { user } = state;
  const [initialUrl] = useState(location.pathname);

  useEffect(() => {
    user.fetchUser().then(result => {
      if (result.error === true && !query.get('token')) {
        history.push('/');
      }
    });
  }, [history, query, user]);

  useEffect(() => {
    if (user.email !== void 0) {
      if (initialUrl && initialUrl.includes('dashboard')) {
        history.push(initialUrl);
      } else {
        history.push('/dashboard/transaction');
      }
    }
  }, [history, initialUrl, user.email]);

  return (
    <div className={css.root}>
      <Route path="/" exact>
        <AuthLogin user={state.user} account={state.account} />
      </Route>
      <Route path="/signup" exact>
        <AuthRegistration user={state.user} />
      </Route>
      <Route path="/restore" exact>
        <AuthRestore user={state.user} />
      </Route>
      <Route path="/reset" exact>
        <AuthReset user={state.user} />
      </Route>
    </div>
  );
});
