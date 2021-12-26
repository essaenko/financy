import React, {ChangeEvent, Dispatch, MouseEvent, useCallback, useEffect, useState} from 'react'
import {observer} from 'mobx-react-lite'
import {Link, useHistory, useRouteMatch} from 'react-router-dom'

import {TransactionTypeList} from "../../models/transaction.model";
import {state} from '../../models'

import {TransactionFormTypeList} from "modules/transaction/transaction.types";

import css from './transaction.module.css';
import {CategoryTypeList} from "../../models/category.model";

export const TransactionEdit = observer((): JSX.Element => {
  const match = useRouteMatch<{ id: string }>()
  const { collection: payments, loaded: paymentsLoaded } = state.payment;
  const { collection: categories, loaded: categoriesLoaded } = state.categories;
  const { collection: transactions, loaded: transactionsLoaded, loading: transactionsLoading } = state.transaction;
  const transaction = transactions.find(
    (transaction) => transaction.id === +match.params.id
  );
  const [payment, setPayment] = useState<number>(transaction?.from?.id!);
  const [type, setType] = useState<TransactionTypeList>(transaction?.type!);
  const [category, setCategory] = useState<number>(transaction?.category?.id!);
  const [cost, setCost] = useState<number>(transaction?.cost!);
  const [comment, setComment] = useState<string>(transaction?.comment!);
  const [transfer, setTransfer] = useState<number>(transaction?.to?.id!);
  const [notification, setNotification] = useState<string>('');
  const history = useHistory();
  const [transactionFormType] = useState<TransactionFormTypeList>(
    transaction?.to ?
      TransactionFormTypeList.Transfer :
      TransactionFormTypeList.Transaction
  );

  useEffect(() => {
    setPayment(transaction?.from?.id!)
    setType(transaction?.type!)
    setCategory(transaction?.category?.id!);
    setCost(transaction?.cost!);
    setComment(transaction?.comment!);
    setTransfer(transaction?.to?.id!);
  }, [transaction]);

  useEffect(() => {
    if (!paymentsLoaded && payments.length === 0) {
      state.payment.fetchPaymentMethods();
    }

    if (!categoriesLoaded && categories.length === 0) {
      state.categories.fetchCategories();
    }

    if (!transactionsLoaded && !transactionsLoading && transactions.length === 0) {
      state.transaction.fetchTransactions();
    }
  }, [categories, categoriesLoaded, payments, paymentsLoaded, transactions, transactionsLoaded, transactionsLoading])

  const onChangeFactory =
    <T extends any>(setter: Dispatch<T>) =>
      (event: ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        setter((!!+event.currentTarget.value ? +event.currentTarget.value : event.currentTarget.value) as T)
      }

  const onSubmit = useCallback(async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    setNotification('');
    if (payment === 0) {
      setNotification(
        transactionFormType === TransactionFormTypeList.Transaction ?
          "Choose payment method for this transaction" :
          "Select from payment method"
      );

      return void 0;
    }

    if (transactionFormType === TransactionFormTypeList.Transaction &&  category === 0) {
      setNotification("Select category for this transaction")

      return void 0
    }

    if (cost === 0) {
      setNotification("Cost can't be less than 1 RUB")

      return void 0
    }

    const result = await state.transaction.updateTransaction(
      transaction?.id!,
      payment,
      transactionFormType === TransactionFormTypeList.Transaction ? type as TransactionTypeList : TransactionTypeList.Outcome,
      transactionFormType === TransactionFormTypeList.Transaction ?
        category :
        categories
          .find((category) => category.type === CategoryTypeList.Outcome && category.name === 'Transfer')!
          .id!,
      cost,
      comment,
      transactionFormType === TransactionFormTypeList.Transfer ? transfer : void 0,
    );

    if (result.success) {
      history.push('/dashboard/transaction');
    } else {
      setNotification('Some error occurred while editing this transaction, please try again or comeback later')
    }

  }, [payment, transactionFormType, category, cost, transaction, type, categories, comment, transfer, history])

  const onRemove = useCallback(async () => {
    const result = await state.transaction.removeTransaction(transaction?.id!);

    if (result.success) {
      history.push('/dashboard/transaction');
    } else {
      setNotification('Something went wrong, please try again')
    }
  }, [history, transaction])

  return (
    <div>
      <div>
        <Link to={'/dashboard/transaction'}>Back</Link>
        <h2>Edit {transactionFormType === TransactionFormTypeList.Transaction ? 'transaction' : 'transfer'}</h2>
      </div>
      <div className={css.transactionCreate}>
        <form>
          <select value={payment} onChange={onChangeFactory<number>(setPayment)}>
            <option value={0} disabled key={0}>
              {transactionFormType === TransactionFormTypeList.Transaction ? 'Payment method' : 'From payment'}
            </option>
            {payments.map((payment) => (
              <option key={payment.id} value={payment.id}>{payment.name}</option>
            ))}
          </select>
          {transactionFormType === TransactionFormTypeList.Transaction && (
            <select value={type} onChange={onChangeFactory<TransactionTypeList>(setType)}>
              <option value={'0'} disabled key={0}>
                Transaction type
              </option>
              <option key={TransactionTypeList.Income} value={TransactionTypeList.Income}>Income</option>
              <option key={TransactionTypeList.Outcome} value={TransactionTypeList.Outcome}>Outcome</option>
            </select>
          )}
          {transactionFormType === TransactionFormTypeList.Transaction && (
            <select value={category} onChange={onChangeFactory<number>(setCategory)}>
              <option value={0} disabled key={0}>
                Category
              </option>
              {categories
                .filter((category) => category.type! === type as unknown as CategoryTypeList)
                .map((category) => (
                  <option value={category.id} key={category.id}>
                    {category.name}
                    {category.parent ? ` (${category.parent.name})` : ''}
                  </option>
                ))}
            </select>
          )}
          <input
            type="number"
            placeholder={
              transactionFormType === TransactionFormTypeList.Transaction ? 'Cost' : 'Amount'
            }
            value={cost}
            onChange={onChangeFactory<number>(setCost)}
          />
          {transactionFormType === TransactionFormTypeList.Transfer && (
            <select value={transfer} onChange={onChangeFactory<number>(setTransfer)}>
              <option value={0} disabled key={0}>
                To payment
              </option>
              {payments.filter((p) => p.id !== payment).map((payment) => (
                <option value={payment.id} key={payment.id}>
                  {payment.name}
                </option>
              ))}
            </select>
          )}
          <input type="text" placeholder={'Comment'} value={comment} onChange={onChangeFactory<string>(setComment)} />
          <div className={css.editActions}>
            <button onClick={onSubmit}>
              Save
            </button>
            <span className={css.removeAction} onClick={onRemove}>
              Remove
            </span>
          </div>
          {notification && (<span>
            {notification}
          </span>)}
        </form>
      </div>
    </div>
  )
})
