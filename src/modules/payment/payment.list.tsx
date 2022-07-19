import React from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import css from 'modules/payment/payment.module.css';
import classnames from 'classnames';
import { state } from '../../models';
import { NetworkComponentStatusList } from '../../api/api.handler';
import { PlusIcon } from 'static/icons';

export const PaymentList = observer(() => {
  const { collection, status } = state.payment;

  return (
    <>
      <div className={css.header}>
        <h2>Payment methods</h2>
        <Link to="/dashboard/payment/create">
          <PlusIcon className={css.icon} />
        </Link>
      </div>
      <div className={css.content}>
        {status === NetworkComponentStatusList.Loading &&
          collection.length === 0 && (
            <div className={css.loader}>
              Loading available payment methods...
            </div>
          )}
        {collection.length === 0 &&
          status === NetworkComponentStatusList.Loaded && (
            <div className={css.loader}>
              No payment methods found...
              <br />
              <br />
              <Link to="/dashboard/payment/create">Create first one</Link>
            </div>
          )}
        {collection.length > 0 && (
          <div className={css.paymentCollection}>
            {collection.map(payment => {
              return (
                <Link
                  to={`/dashboard/payment/edit/${payment.id}`}
                  className={css.paymentMethod}
                  key={payment.id}
                >
                  <div className={css.paymentName}>{payment.name}</div>
                  <div className={css.paymentRemains}>
                    {new Intl.NumberFormat().format(payment.remains ?? 0)} RUB
                  </div>
                  <div className={css.paymentDescription}>
                    {payment.description}
                  </div>
                  <div className={css.paymentOwner}>
                    {payment.account?.owner?.name}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
});
