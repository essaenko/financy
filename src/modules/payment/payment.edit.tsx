import React, {ChangeEvent, Dispatch, MouseEvent, useCallback, useEffect, useState} from 'react'
import { observer } from 'mobx-react-lite'
import {useHistory, useRouteMatch} from "react-router-dom";

import {state} from "../../models";

import css from './payment.module.css';

export const PaymentEdit = observer((): JSX.Element => {
  const match = useRouteMatch<{ id: string }>();
  const { collection: payments, loading, loaded } = state.payment;
  const payment = payments.find((p) => p.id === +match.params.id)
  const [name, setName] = useState<string>(payment?.name ?? "")
  const [description, setDescription] = useState<string>(payment?.description ?? "")
  const [remains, setRemains] = useState<number | undefined>(payment?.remains)
  const [notification, setNotification] = useState<string>("");
  const history = useHistory();

  useEffect(() => {
    if (!loaded && !loading) {
      state.payment.fetchPaymentMethods();
    }
  }, [loaded, loading])

  useEffect(() => {
    setName(payment?.name!)
    setDescription(payment?.description!)
    setRemains(payment?.remains!)
  }, [payment])

  const onChangeFactory = <T extends any>(setter: Dispatch<T>) => (event: ChangeEvent<HTMLInputElement>) => {
    setter(event.currentTarget.value as T);
  }

  const onSubmit = useCallback(async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setNotification("");

    if (!name) {
      setNotification("Name can't be empty")

      return void 0;
    }

    const result = await state.payment.updatePayment(payment?.id!, name, description, remains ?? 0);

    if (result.success) {
      history.push('/dashboard/payment')
    } else {
      setNotification('Some error occurred while editing this payment method, try again or comeback later')
    }
  }, [name, payment, description, remains, history]);

  const onRemove = useCallback(async () => {
    const result = await state.payment.removePayment(payment?.id!);

    if (result.success) {
      history.push('/dashboard/payment')
    } else {
      setNotification('Something went wrong, please try again')
    }
  }, [history, payment]);

  return (
    <div>
      <h2>Edit payment method</h2>
      <div className={css.createForm}>
        <form>
          <input
            type="text"
            value={name}
            placeholder={'Name'}
            onChange={onChangeFactory<string>(setName)}
          />
          <input
            type="text"
            value={description}
            placeholder={'Description'}
            onChange={onChangeFactory<string>(setDescription)}
          />
          <input
            type="number"
            value={remains}
            placeholder={'Remains'}
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
  )
})
