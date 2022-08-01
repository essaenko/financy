import React from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import { state } from 'models';
import { NetworkComponentStatusList } from 'api/api.handler';
import { PlusIcon } from 'static/icons';

import css from 'modules/payment/payment.module.css';

export const PaymentList = observer(() => {
  const { collection: accounts, status: accountsStatus } =
    state.payment.account;
  const { collection: methods, status: methodsStatus } = state.payment.method;

  return (
    <>
      <div className={css.header}>
        <h2>Payment accounts</h2>
        <Link to="/dashboard/payment/create?type=Account">
          <PlusIcon className={css.icon} />
        </Link>
      </div>
      <div className={css.content}>
        {methodsStatus === NetworkComponentStatusList.Loading &&
          methods.length === 0 && (
            <div className={css.loader}>
              Loading available payment methods...
            </div>
          )}
        {accounts.length === 0 &&
          accountsStatus === NetworkComponentStatusList.Loaded && (
            <div className={css.loader}>
              No payment accounts found...
              <br />
              <br />
              <Link to="/dashboard/payment/create?type=Account">
                Create first one
              </Link>
            </div>
          )}
        {accounts.length > 0 && (
          <div className={css.paymentAccountCollection}>
            {accounts.map(account => {
              return (
                <div className={css.paymentAccount} key={account.id}>
                  <div className={css.accountHeader}>
                    <div className={css.accountName}>{account.name}: </div>
                    <div className={css.accountRemains}>
                      {new Intl.NumberFormat().format(account.remains ?? 0)} RUB
                    </div>
                    <Link
                      className={css.addLink}
                      to={`/dashboard/payment/create?type=Method&account=${account.id}`}
                    >
                      <PlusIcon />
                    </Link>
                    <Link
                      className={css.editLink}
                      to={`/dashboard/payment/edit/${account.id}?type=Account`}
                    >
                      Edit
                    </Link>
                  </div>
                  <div className={css.accountDescription}>
                    {account.description}
                  </div>
                  <div className={css.paymentCollection}>
                    {methods.filter(p => p.account?.id === account.id)
                      .length === 0 && (
                      <div className={css.loader}>
                        No payment methods found for this account...
                        <br />
                        <Link
                          to={`/dashboard/payment/create?type=Method&account=${account.id}`}
                        >
                          Add new one
                        </Link>
                      </div>
                    )}
                    {methods
                      .filter(p => p.account?.id === account.id)
                      .map(payment => {
                        return (
                          <Link
                            className={css.paymentMethod}
                            to={`/dashboard/payment/edit/${payment.id}?type=Method`}
                            key={payment.id}
                          >
                            <div className={css.paymentName}>
                              {payment.name}
                            </div>
                            <div className={css.paymentDescription}>
                              {payment.description}
                            </div>
                            <div className={css.paymentOwner}>
                              {payment.owner?.name}
                            </div>
                          </Link>
                        );
                      })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
});
