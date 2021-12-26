import { APIParsedResponse, requestHandler } from './api.handler'
import {
  TransactionModel,
  TransactionTypeList,
} from '../models/transaction.model'
import { api } from './api.transport'

export const fetchTransactions = async (
  page: number
): Promise<APIParsedResponse<TransactionModel[]>> => {
  return await requestHandler<TransactionModel[]>(
    api.get('/transaction', { page })
  )
}

export const createTransaction = async (
  from: number,
  type: TransactionTypeList,
  category: number,
  cost: number,
  date: number,
  comment?: string,
  to?: number
): Promise<APIParsedResponse<TransactionModel>> => {
  const payload: {
    from: number,
    type: TransactionTypeList,
    category: number,
    cost: number,
    date: number,
    comment?: string,
    to?: number,
  } = {
    from,
    category,
    type,
    cost,
    date,
  }

  if (comment) {
    payload.comment = comment
  }

  if (to) {
    payload.to = to
  }

  return await requestHandler<TransactionModel>(
    api.post('/transaction/create', payload)
  )
}

export const removeTransaction = async (
  id: number
): Promise<APIParsedResponse<void>> => {
  return await requestHandler<void>(api.post('/transaction/remove', { id }))
}

export const updateTransaction = async (
  id: number,
  from: number,
  type: TransactionTypeList,
  category: number,
  cost: number,
  comment?: string,
  to?: number
): Promise<APIParsedResponse<TransactionModel>> => {
  const payload: {
    id: number,
    from: number,
    type: TransactionTypeList,
    category: number,
    cost: number,
    comment?: string,
    to?: number,
  } = {
    id,
    from,
    category,
    type,
    cost,
  }

  if (comment) {
    payload.comment = comment
  }

  if (to) {
    payload.to = to
  }

  return await requestHandler<TransactionModel>(
    api.post('/transaction/update', payload)
  )
}
