import React, { useCallback, useEffect, MouseEvent } from 'react';
import { Link } from 'react-router-dom';

import { observer } from 'mobx-react-lite';

import { state } from 'models';

import css from './account.module.css';
import { FamilyRequestState } from '../../models/familyrequest.model';

export const Account = observer((): JSX.Element => {
  const { users } = state.account;
  const { collection: fRequests } = state.family;
  useEffect(() => {
    state.account.fetchAccountUsers();
    state.family.fetchFamilyRequests();
  }, []);
  const onApproveRequest = useCallback(
    (request: FamilyRequestState) =>
      async (event: MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();

        await request.approveRequest();
        await state.account.fetchAccountUsers();
        await state.family.fetchFamilyRequests();
      },
    [],
  );
  const onRejectRequest = useCallback(
    (request: FamilyRequestState) =>
      async (event: MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();

        await request.rejectRequest();
        await state.family.fetchFamilyRequests();
      },
    [],
  );

  return (
    <div className={css.root}>
      <h2>Account</h2>
      <div className={css.ownerData}>
        Account owner: {state.account.owner?.name}
      </div>
      <div className={css.ownerData}>E-mail: {state.account.owner?.email}</div>
      <div>
        <h3>Family users:</h3>
        {}
        {users.map(user => (
          <div key={user.id}>
            {user.name} {user.id === state.user.id && ' (You)'}
          </div>
        ))}
        {users.length === 1 && (
          <div className={css.emptyList}>No additional users...</div>
        )}
      </div>
      <div className={css.pendingRequests}>
        {fRequests.length > 0 && <h3>Pending requests:</h3>}
        {fRequests.map(request => (
          <div key={request.id} className={css.pendingRequest}>
            {request.user} -{' '}
            <Link to="/dashboard/account" onClick={onApproveRequest(request)}>
              Approve
            </Link>{' '}
            <Link
              className={css.rejectRequest}
              to="/dashboard/account"
              onClick={onRejectRequest(request)}
            >
              Reject
            </Link>
          </div>
        ))}
      </div>
      <a className={css.footerLink} href="mailto:support@financy.live">
        Support
      </a>
      <span>Financy © 2022</span>
    </div>
  );
});
