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

import { APIParsedResponse, NetworkComponentStatusList } from 'api/api.handler';
import { PaymentFormTypeList } from 'modules/payment/payment';
import { useQuery } from 'utils/url.utils';

import { state } from 'models';
import { PaymentAccountModel } from 'models/payment.account.model';
import { PaymentMethodModel } from 'models/payment.method.model';

import css from './payment.module.css';

export const PaymentEdit = observer((): JSX.Element => {
  const match = useRouteMatch<{ id: string }>();
  const query = useQuery();
  const formType = query.get('type') as keyof typeof PaymentFormTypeList;
  const { collection: accounts, status: accountsStatus } =
    state.payment.account;
  const { collection: methods, status: methodsStatus } = state.payment.method;
  const payment = methods.find(p => p.id === +match.params.id);
  const account = accounts.find(acc => acc.id === +match.params.id);
  const [name, setName] = useState<string>(
    (formType === PaymentFormTypeList.Account
      ? account?.name
      : payment?.name) ?? '',
  );
  const [description, setDescription] = useState<string>(
    (formType === PaymentFormTypeList.Account
      ? account?.description
      : payment?.description) ?? '',
  );
  const [remains, setRemains] = useState<number | undefined>(account?.remains);
  const [notification, setNotification] = useState<string>('');
  const history = useHistory();

  useEffect(() => {
    if (methodsStatus === NetworkComponentStatusList.Untouched) {
      state.payment.method.fetchPaymentMethods();
    }
    if (accountsStatus === NetworkComponentStatusList.Untouched) {
      state.payment.account.fetchPaymentAccounts();
    }
  }, [methodsStatus, accountsStatus]);

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
        setNotification('Название не может быть пустым');

        return void 0;
      }

      if (payment?.id) {
        let result: APIParsedResponse<PaymentAccountModel | PaymentMethodModel>;

        if (formType === PaymentFormTypeList.Account) {
          result = await state.payment.account.updatePayment(
            payment.id,
            name,
            description,
            remains ?? 0,
          );
        } else {
          result = await state.payment.method.updatePayment(
            payment.id,
            name,
            description,
          );
        }

        if (result.success) {
          history.push('/dashboard/payment');
        } else {
          setNotification(
            'Что-то пошло не так, пожалуйста повторите попытку или вернитесь познее',
          );
        }
      }

      return void 0;
    },
    [name, payment?.id, formType, description, remains, history],
  );

  const onRemove = useCallback(async () => {
    if (payment?.id) {
      let result: APIParsedResponse<void>;

      if (formType === PaymentFormTypeList.Account) {
        result = await state.payment.account.removePayment(payment?.id);
      } else {
        result = await state.payment.method.removePayment(payment?.id);
      }

      if (result.success) {
        history.push('/dashboard/payment');
      } else {
        setNotification(
          'Что-то пошло не так, пожалуйста повторите попытку или вернитесь познее',
        );
      }
    }
  }, [formType, history, payment?.id]);

  return (
    <div>
      <div>
        <Link to="/dashboard/payment">Back</Link>
        <h2>
          Изменить{' '}
          {formType === PaymentFormTypeList.Account
            ? 'счет'
            : 'средство платежа'}
        </h2>
      </div>
      <div className={css.createForm}>
        <form>
          <input
            type="text"
            value={name}
            placeholder="Название"
            onChange={onChangeFactory<string>(setName)}
          />
          <input
            type="text"
            value={description}
            placeholder="Описание"
            onChange={onChangeFactory<string>(setDescription)}
          />
          {formType === PaymentFormTypeList.Account && (
            <input
              type="number"
              value={remains}
              placeholder="Остаток"
              onChange={onChangeFactory<number>(setRemains)}
            />
          )}
          <div className={css.editActions}>
            <button onClick={onSubmit}>Сохранить</button>
            <span className={css.removeAction} onClick={onRemove}>
              Удалить
            </span>
          </div>
          {notification && <span>{notification}</span>}
        </form>
      </div>
    </div>
  );
});
