import React, {
  ChangeEvent,
  Dispatch,
  MouseEvent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { observer } from 'mobx-react-lite';
import { Link, useHistory, useRouteMatch } from 'react-router-dom';

import { state } from '../../models';

import css from './payment.module.css';
import { NetworkComponentStatusList } from '../../api/api.handler';

export const PaymentEdit = observer((): JSX.Element => {
  const match = useRouteMatch<{ id: string }>();
  const { collection: payments, status } = state.payment;
  const payment = payments.find(p => p.id === +match.params.id);
  const [name, setName] = useState<string>(payment?.name ?? '');
  const [description, setDescription] = useState<string>(
    payment?.description ?? '',
  );
  const [remains, setRemains] = useState<number | undefined>(payment?.remains);
  const [notification, setNotification] = useState<string>('');
  const history = useHistory();

  useEffect(() => {
    if (status === NetworkComponentStatusList.Untouched) {
      state.payment.fetchPaymentMethods();
    }
  }, [status]);

  useEffect(() => {
    if (payment?.name) {
      setName(payment?.name);
    }
    if (payment?.description) {
      setDescription(payment?.description);
    }
    if (payment?.remains) {
      setRemains(payment?.remains);
    }
  }, [payment]);

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

      if (payment?.id) {
        const result = await state.payment.updatePayment(
          payment?.id,
          name,
          description,
          remains ?? 0,
        );

        if (result.success) {
          history.push('/dashboard/payment');
        } else {
          setNotification(
            'Some error occurred while editing this payment method, try again or comeback later',
          );
        }
      }

      return void 0;
    },
    [name, payment, description, remains, history],
  );

  const onRemove = useCallback(async () => {
    if (payment?.id) {
      const result = await state.payment.removePayment(payment?.id);

      if (result.success) {
        history.push('/dashboard/payment');
      } else {
        setNotification('Something went wrong, please try again');
      }
    }
  }, [history, payment]);

  return (
    <div>
      <div>
        <Link to="/dashboard/payment">Back</Link>
        <h2>Edit payment method</h2>
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
          <div className={css.editActions}>
            <button onClick={onSubmit}>Save</button>
            <span className={css.removeAction} onClick={onRemove}>
              Remove
            </span>
          </div>
          {notification && <span>{notification}</span>}
        </form>
      </div>
    </div>
  );
});