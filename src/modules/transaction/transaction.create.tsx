import React, {ChangeEvent, Dispatch, MouseEvent, useCallback, useEffect, useState} from 'react'
import {observer} from 'mobx-react-lite'
import {Link, useHistory} from 'react-router-dom'

import {Picker} from "../../components";

import {state} from '../../models'
import {TransactionTypeList} from '../../models/transaction.model'
import {CategoryTypeList} from "../../models/category.model";

import {TransactionFormTypeList} from "modules/transaction/transaction.types";

import css from './transaction.module.css'
import {NetworkComponentStatusList} from "../../api/api.handler";

export const TransactionCreate = observer((): JSX.Element => {
  const [payment, setPayment] = useState<number>(0)
  const [type, setType] = useState<TransactionTypeList | 0>(0);
  const [category, setCategory] = useState<number>(0);
  const [cost, setCost] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [transfer, setTransfer] = useState<number>(0);
  const [notification, setNotification] = useState<string>('');
  const [transactionFormType, setTransactionFormType] = useState<TransactionFormTypeList>(TransactionFormTypeList.Transaction);
  const history = useHistory();
  const { collection: payments, status: paymentsStatus } = state.payment
  const { collection: categories, status: categoriesStatus } = state.categories

  useEffect(() => {
    if (paymentsStatus === NetworkComponentStatusList.Untouched) {
      state.payment.fetchPaymentMethods();
    }

    if (categoriesStatus === NetworkComponentStatusList.Untouched) {
      state.categories.fetchCategories();
    }
  }, [categories, categoriesStatus, payments, paymentsStatus])

  const onChangeTransactionType = (id: TransactionFormTypeList) => () => {
    setTransactionFormType(id);
    setNotification("");
  }

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

    if (type === 0 && transactionFormType === TransactionFormTypeList.Transaction) {
      setNotification("Select type (Income or Outcome) for this transaction")

      return void 0
    }

    if (transactionFormType === TransactionFormTypeList.Transaction &&  category === 0) {
      setNotification("Select category for this transaction")

      return void 0
    }

    if (cost === 0) {
      setNotification("Cost can't be less than 1 RUB")

      return void 0
    }

    if (transactionFormType === TransactionFormTypeList.Transfer && transfer === 0) {
      setNotification("Please specify the transfer payment method")

      return void 0
    }

    const result = await state.transaction.createTransaction(
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
      setNotification('Some error occurred while creating new transaction, please try again or comeback later')
    }

  }, [payment, type, category, cost, transactionFormType, categories, comment, transfer, history])

  return (
    <div>
      <div>
        <div className={css.headerMenu}>
          <Link
            to={{
              pathname: '/dashboard/transaction',
              search: history.location.search
            }}
          >
            Back
          </Link>
          <Picker
            className={css.picker}
            elements={[
              {
                id: TransactionFormTypeList.Transaction,
                text: "Transaction"
              },
              {
                id: TransactionFormTypeList.Transfer,
                text: "Transfer"
              }
            ]}
            active={transactionFormType}
            onChange={onChangeTransactionType}
          />
        </div>
        <h2>{transactionFormType === TransactionFormTypeList.Transaction ? 'New transaction' : 'Transfer'}</h2>
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
                .filter((category) =>
                  typeof type === 'number' || category.type! === type as unknown as CategoryTypeList
                )
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
          <button onClick={onSubmit}>
            {transactionFormType === TransactionFormTypeList.Transaction ? 'Add' : 'Transfer'}
          </button>
          {notification && (<span>
            {notification}
          </span>)}
        </form>
      </div>
    </div>
  )
})
