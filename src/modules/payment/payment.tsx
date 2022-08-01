import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Route } from 'react-router-dom';

import { PaymentList } from 'modules/payment/payment.list';
import { PaymentCreate } from 'modules/payment/payment.create';
import { PaymentEdit } from 'modules/payment/payment.edit';

import { state } from '../../models';

import css from './payment.module.css';

export enum PaymentFormTypeList {
  Account = 'Account',
  Method = 'Method',
}

export const Payment = observer((): JSX.Element => {
  useEffect(() => {
    state.payment.account.fetchPaymentAccounts().then(async () => {
      await state.payment.method.fetchPaymentMethods();
    });
  }, []);
  return (
    <div className={css.root}>
      <Route path="/dashboard/payment" exact>
        <PaymentList />
      </Route>
      <Route path="/dashboard/payment/create" exact>
        <PaymentCreate />
      </Route>
      <Route path="/dashboard/payment/edit/:id">
        <PaymentEdit />
      </Route>
    </div>
  );
});
