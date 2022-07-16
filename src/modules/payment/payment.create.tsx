import React, {
  Dispatch,
  useState,
  ChangeEvent,
  useCallback,
  MouseEvent,
} from 'react';
import { Link, useHistory } from 'react-router-dom';

import { state } from '../../models';

import css from './payment.module.css';

export const PaymentCreate = (): JSX.Element => {
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

      const result = await state.payment.createPayment(
        name,
        description,
        remains ?? 0,
      );

      if (result.success) {
        history.push('/dashboard/payment');
      } else {
        setNotification(
          'Some error occurred while creating new payment method, try again or comeback later',
        );
      }

      return void 0;
    },
    [name, description, remains, history],
  );

  return (
    <>
      <div>
        <Link to="/dashboard/payment">Back</Link>
        <h2>New payment method</h2>
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
          <input
            type="number"
            value={remains}
            placeholder="Remains"
            onChange={onChangeFactory<number>(setRemains)}
          />
          <button onClick={onSubmit}>Create</button>
          {notification && <span>{notification}</span>}
        </form>
      </div>
    </>
  );
};
