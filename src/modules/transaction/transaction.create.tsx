import React, {
  ChangeEvent,
  Dispatch,
  MouseEvent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { observer } from 'mobx-react-lite';
import { Link, useHistory, NavLink } from 'react-router-dom';

import { TransactionFormTypeList } from 'modules/transaction/transaction.types';
import { Picker } from '../../components';

import { state } from '../../models';
import { TransactionTypeList } from 'models/transaction.model';
import { CategoryTypeList } from 'models/category.model';

import css from './transaction.module.css';
import { NetworkComponentStatusList } from 'api/api.handler';

export const TransactionCreate = observer((): JSX.Element => {
  const [payment, setPayment] = useState<number>(0);
  const [type, setType] = useState<TransactionTypeList | 0>(0);
  const [category, setCategory] = useState<number>(0);
  const [cost, setCost] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [transfer, setTransfer] = useState<number>(0);
  const [notification, setNotification] = useState<string>('');
  const [transactionFormType, setTransactionFormType] =
    useState<TransactionFormTypeList>(TransactionFormTypeList.Transaction);
  const history = useHistory();
  const { collection: payments, status: paymentsStatus } = state.payment.method;
  const { collection: categories, status: categoriesStatus } = state.categories;

  useEffect(() => {
    if (paymentsStatus === NetworkComponentStatusList.Untouched) {
      state.payment.method.fetchPaymentMethods();
    }

    if (categoriesStatus === NetworkComponentStatusList.Untouched) {
      state.categories.fetchCategories();
    }
  }, [categories, categoriesStatus, payments, paymentsStatus]);

  const onChangeTransactionType = (id: string | number) => () => {
    setTransactionFormType(id as TransactionFormTypeList);
    setNotification('');
  };

  const onChangeFactory =
    <T extends unknown>(setter: Dispatch<T>) =>
    (event: ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
      setter(
        (+event.currentTarget.value
          ? +event.currentTarget.value
          : event.currentTarget.value) as T,
      );
    };

  const onSubmit = useCallback(
    async (event: MouseEvent<HTMLButtonElement>): Promise<void> => {
      event.preventDefault();

      setNotification('');
      if (payment === 0) {
        setNotification(
          transactionFormType === TransactionFormTypeList.Transaction
            ? 'Выберите средство платежа для операции'
            : 'Select from payment method',
        );

        return void 0;
      }

      if (
        type === 0 &&
        transactionFormType === TransactionFormTypeList.Transaction
      ) {
        setNotification('Выберите тип операции (Доходы или Расходы)');

        return void 0;
      }

      if (
        transactionFormType === TransactionFormTypeList.Transaction &&
        category === 0
      ) {
        setNotification('Выберите категорию операции');

        return void 0;
      }

      if (cost === 0) {
        setNotification('Сумма не может быть меньше 1 ₽');

        return void 0;
      }

      if (
        transactionFormType === TransactionFormTypeList.Transfer &&
        transfer === 0
      ) {
        setNotification('Укажите средство платежа получателя');

        return void 0;
      }

      const transferCategory = categories.find(
        category =>
          category.type === CategoryTypeList.Outcome &&
          category.name === 'Transfer',
      );
      const result = await state.transaction.createTransaction(
        payment,
        transactionFormType === TransactionFormTypeList.Transaction
          ? (type as TransactionTypeList)
          : TransactionTypeList.Outcome,
        transactionFormType === TransactionFormTypeList.Transaction
          ? category
          : (transferCategory?.id as number),
        cost,
        comment,
        transactionFormType === TransactionFormTypeList.Transfer
          ? transfer
          : void 0,
      );

      if (result.success) {
        history.push('/dashboard/transaction');
      } else {
        setNotification(
          'Что-то пошло не так, повторите попытку или вернитесь позднее',
        );
      }

      return void 0;
    },
    [
      payment,
      type,
      category,
      cost,
      transactionFormType,
      categories,
      comment,
      transfer,
      history,
    ],
  );

  return (
    <div>
      <div>
        <div className={css.headerMenu}>
          <Link
            to={{
              pathname: '/dashboard/transaction',
              search: history.location.search,
            }}
          >
            Назад
          </Link>
          <Picker
            className={css.picker}
            elements={[
              {
                id: TransactionFormTypeList.Transaction,
                text: 'Операция',
              },
              {
                id: TransactionFormTypeList.Transfer,
                text: 'Перевод',
              },
            ]}
            active={transactionFormType}
            onChange={onChangeTransactionType}
          />
        </div>
        <h2>
          {transactionFormType === TransactionFormTypeList.Transaction
            ? 'Новая операция'
            : 'Перевод'}
        </h2>
      </div>
      <div className={css.transactionCreate}>
        <form>
          <div>
            <select
              value={payment}
              onChange={onChangeFactory<number>(setPayment)}
            >
              <option value={0} disabled key={0}>
                {transactionFormType === TransactionFormTypeList.Transaction
                  ? 'Средство платежа'
                  : 'Карта отправитель'}
              </option>
              {payments.map(payment => (
                <option key={payment.id} value={payment.id}>
                  {payment.name} ({payment.account?.name}) ---{' '}
                  {payment.owner?.name}
                </option>
              ))}
            </select>
            <NavLink to="/dashboard/payment/create?type=Account">
              Создать
            </NavLink>
          </div>
          {transactionFormType === TransactionFormTypeList.Transaction && (
            <select
              value={type}
              onChange={onChangeFactory<TransactionTypeList>(setType)}
            >
              <option value="0" disabled key={0}>
                Тип операции
              </option>
              <option
                key={TransactionTypeList.Income}
                value={TransactionTypeList.Income}
              >
                Доходы
              </option>
              <option
                key={TransactionTypeList.Outcome}
                value={TransactionTypeList.Outcome}
              >
                Расходы
              </option>
            </select>
          )}
          {transactionFormType === TransactionFormTypeList.Transaction && (
            <select
              value={category}
              onChange={onChangeFactory<number>(setCategory)}
            >
              <option value={0} disabled key={0}>
                Категория
              </option>
              {categories
                .filter(
                  category =>
                    typeof type === 'number' ||
                    category.type === (type as unknown as CategoryTypeList),
                )
                .map(category => (
                  <option value={category.id} key={category.id}>
                    {category.name}
                    {category.parent ? ` (${category.parent.name})` : ''}
                  </option>
                ))}
            </select>
          )}
          <input
            type="number"
            placeholder="Сумма"
            value={cost}
            onChange={onChangeFactory<number>(setCost)}
          />
          {transactionFormType === TransactionFormTypeList.Transfer && (
            <select
              value={transfer}
              onChange={onChangeFactory<number>(setTransfer)}
            >
              <option value={0} disabled key={0}>
                Карта получатель
              </option>
              {payments
                .filter(p => p.id !== payment)
                .map(payment => (
                  <option value={payment.id} key={payment.id}>
                    {payment.name} ({payment.account?.name}){' '}
                    {payment.owner?.name}
                  </option>
                ))}
            </select>
          )}
          <input
            type="text"
            placeholder="Коментарий"
            value={comment}
            onChange={onChangeFactory<string>(setComment)}
          />
          <button onClick={onSubmit}>
            {transactionFormType === TransactionFormTypeList.Transaction
              ? 'Создать'
              : 'Перевести'}
          </button>
          {notification && <span>{notification}</span>}
        </form>
      </div>
    </div>
  );
});
