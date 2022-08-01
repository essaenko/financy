import React, {
  Dispatch,
  useState,
  ChangeEvent,
  useCallback,
  MouseEvent,
} from 'react';
import { Link, useHistory } from 'react-router-dom';

import { state } from 'models';
import { useQuery } from 'utils/url.utils';
import { APIParsedResponse } from 'api/api.handler';
import { PaymentMethodModel } from 'models/payment.method.model';
import { PaymentAccountModel } from 'models/payment.account.model';
import { PaymentFormTypeList } from 'modules/payment/payment';

import css from './payment.module.css';

export const PaymentCreate = (): JSX.Element => {
  const query = useQuery();
  const formType = query.get('type') as keyof typeof PaymentFormTypeList;
  const account = Number(query.get('account'));
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [remains, setRemains] = useState<number | undefined>(void 0);
  const [notification, setNotification] = useState<string>('');
  const history = useHistory();

  const onChangeFactory =
    <T extends unknown>(setter: Dispatch<T>) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setter(event.currentTarget.value as T);
    };

  const onSubmit = useCallback(
    async (event: MouseEvent<HTMLButtonElement>): Promise<void> => {
      event.preventDefault();
      setNotification('');

      if (!name) {
        setNotification("Name can't be empty");

        return void 0;
      }

      if (formType === PaymentFormTypeList.Method && !account) {
        setNotification(
          'Something went wrong, please reload this page and try again',
        );

        return void 0;
      }

      let result: APIParsedResponse<PaymentMethodModel | PaymentAccountModel>;

      if (formType === PaymentFormTypeList.Account) {
        result = await state.payment.account.createPayment(
          name,
          description,
          remains ?? 0,
        );
      } else {
        result = await state.payment.method.createPayment(
          account,
          name,
          description,
        );
      }

      if (result.success) {
        history.push('/dashboard/payment');
      } else {
        setNotification(
          'Some error occurred while creating new payment method, try again or comeback later',
        );
      }

      return void 0;
    },
    [name, formType, account, description, remains, query, history],
  );

  return (
    <>
      <div>
        <Link to="/dashboard/payment">Back</Link>
        <h2>
          New payment{' '}
          {formType === PaymentFormTypeList.Account ? 'account' : 'method'}
        </h2>
      </div>
      <div className={css.createForm}>
        <form>
          <input
            type="text"
            value={name}
            placeholder="Name"
            onChange={onChangeFactory<string>(setName)}
          />
          <input
            type="text"
            value={description}
            placeholder="Description"
            onChange={onChangeFactory<string>(setDescription)}
          />
          {formType === PaymentFormTypeList.Account && (
            <input
              type="number"
              value={remains}
              placeholder="Remains"
              onChange={onChangeFactory<number>(setRemains)}
            />
          )}
          <button onClick={onSubmit}>Create</button>
          {notification && <span>{notification}</span>}
        </form>
      </div>
    </>
  );
};
