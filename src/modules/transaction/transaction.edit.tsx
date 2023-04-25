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

import { TransactionFormTypeList } from 'modules/transaction/transaction.types';
import { TransactionTypeList } from 'models/transaction.model';
import { CategoryTypeList } from 'models/category.model';
import { NetworkComponentStatusList } from 'api/api.handler';
import { state } from '../../models';

import css from './transaction.module.css';
import { dateTimeToString } from 'utils/date.utils';

export const TransactionEdit = observer((): JSX.Element => {
  const match = useRouteMatch<{ id: string }>();
  const { collection: payments, status: paymentsStatus } = state.payment.method;
  const { collection: categories, status: categoriesStatus } = state.categories;
  const { collection: transactions, status } = state.transaction;
  const transaction = transactions.find(
    transaction => transaction.id === +match.params.id,
  );
  const [payment, setPayment] = useState<number>(0);
  const [type, setType] = useState<TransactionTypeList>(
    TransactionTypeList.All,
  );
  const [category, setCategory] = useState<number>(0);
  const [cost, setCost] = useState<number>(0);
  const [date, setDate] = useState<string>(
    transaction?.createdAt ?? dateTimeToString(new Date()),
  );
  const [comment, setComment] = useState<string>('');
  const [transfer, setTransfer] = useState<number>(0);
  const [notification, setNotification] = useState<string>('');
  const history = useHistory();
  const [transactionFormType] = useState<TransactionFormTypeList>(
    transaction?.to
      ? TransactionFormTypeList.Transfer
      : TransactionFormTypeList.Transaction,
  );

  useEffect(() => {
    if (transaction?.from?.id) {
      setPayment(transaction.from.id);
    }
    if (transaction?.type) {
      setType(transaction?.type);
    }
    if (transaction?.category?.id) {
      setCategory(transaction?.category?.id);
    }
    if (transaction?.cost) {
      setCost(transaction?.cost);
    }
    if (transaction?.comment) {
      setComment(transaction?.comment);
    }
    if (transaction?.to?.id) {
      setTransfer(transaction?.to?.id);
    }
  }, [transaction]);

  useEffect(() => {
    if (paymentsStatus === NetworkComponentStatusList.Untouched) {
      state.payment.method.fetchPaymentMethods();
    }

    if (categoriesStatus === NetworkComponentStatusList.Untouched) {
      state.categories.fetchCategories();
    }

    if (status === NetworkComponentStatusList.Untouched) {
      state.transaction.fetchTransactions();
    }
  }, [
    categories,
    categoriesStatus,
    payments,
    paymentsStatus,
    status,
    transactions,
  ]);

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
    async (event: MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();

      setNotification('');
      if (payment === 0) {
        setNotification(
          transactionFormType === TransactionFormTypeList.Transaction
            ? 'Выберите средство платежа для этой операции'
            : 'Выберите карту отправителя',
        );

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

      if (transaction?.id) {
        const transferCategory = categories?.find(
          category =>
            category.type === CategoryTypeList.Outcome &&
            category.name === 'Transfer',
        );
        const result = await state.transaction.updateTransaction(
          transaction.id,
          payment,
          transactionFormType === TransactionFormTypeList.Transaction
            ? (type as TransactionTypeList)
            : TransactionTypeList.Outcome,
          transactionFormType === TransactionFormTypeList.Transaction
            ? category
            : (transferCategory?.id as number),
          cost,
          date,
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
      }

      return void 0;
    },
    [
      payment,
      transactionFormType,
      category,
      cost,
      transaction,
      type,
      categories,
      comment,
      date,
      transfer,
      history,
    ],
  );

  const onRemove = useCallback(async () => {
    if (transaction?.id) {
      const result = await state.transaction.removeTransaction(transaction.id);

      if (result.success) {
        history.push('/dashboard/transaction');
      } else {
        setNotification(
          'Что-то пошло не так, повторите попытку или вернитесь позднее',
        );
      }
    }
  }, [history, transaction]);

  return (
    <div>
      <div>
        <Link
          to={{
            pathname: '/dashboard/transaction',
            search: history.location.search,
          }}
        >
          Назад
        </Link>
        <h2>
          Изменить{' '}
          {transactionFormType === TransactionFormTypeList.Transaction
            ? 'операцию'
            : 'перевод'}
        </h2>
      </div>
      <div className={css.transactionCreate}>
        <form>
          <select
            value={payment}
            onChange={onChangeFactory<number>(setPayment)}
          >
            <option value={0} disabled key={0}>
              {transactionFormType === TransactionFormTypeList.Transaction
                ? 'Средство платежа'
                : 'Карта отправителя'}
            </option>
            {payments.map(payment => (
              <option key={payment.id} value={payment.id}>
                {payment.name} ({payment.account?.name}) ---{' '}
                {payment.owner?.name}
              </option>
            ))}
          </select>
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
                Карта получателя
              </option>
              {payments
                .filter(p => p.id !== payment)
                .map(payment => (
                  <option value={payment.id} key={payment.id}>
                    {payment.name}
                  </option>
                ))}
            </select>
          )}
          <input
            type="datetime-local"
            placeholder="Дата операции"
            value={date}
            onChange={onChangeFactory<string>(setDate)}
          />
          <input
            type="text"
            placeholder="Коментарий"
            value={comment}
            onChange={onChangeFactory<string>(setComment)}
          />
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
