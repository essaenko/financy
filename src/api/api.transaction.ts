import {
  APIParsedResponse,
  CollectionResponse,
  requestHandler,
} from './api.handler';
import {
  TransactionModel,
  TransactionTypeList,
} from 'models/transaction.model';
import { api } from './api.transport';

export const uploadTransactions = async (
  data: FormData,
): Promise<APIParsedResponse<void>> => {
  return requestHandler(api.upload('/transaction/import', data));
};

export const fetchTransactions = async (
  page: number,
  perPage: number,
  type?: TransactionTypeList,
  category?: number,
  dateFrom?: number,
  dateTo?: number,
  date?: number,
): Promise<APIParsedResponse<CollectionResponse<TransactionModel[]>>> => {
  return requestHandler<CollectionResponse<TransactionModel[]>>(
    api.get('/transaction', {
      page,
      perPage,
      type: type?.toString() ?? null,
      dateFrom: dateFrom ?? null,
      dateTo: dateTo ?? null,
      date: date ?? null,
      category: category ?? null,
    }),
  );
};

export const createTransaction = async (
  from: number,
  type: TransactionTypeList,
  category: number,
  cost: number,
  date: number,
  comment?: string,
  to?: number,
): Promise<APIParsedResponse<TransactionModel>> => {
  const payload: {
    from: number;
    type: TransactionTypeList;
    category: number;
    cost: number;
    date: number;
    comment?: string;
    to?: number;
  } = {
    from,
    category,
    type,
    cost,
    date,
  };

  if (comment) {
    payload.comment = comment;
  }

  if (to) {
    payload.to = to;
  }

  return requestHandler<TransactionModel>(
    api.post('/transaction/create', payload),
  );
};

export const removeTransaction = async (
  id: number,
): Promise<APIParsedResponse<void>> => {
  return requestHandler<void>(api.post('/transaction/remove', { id }));
};

export const updateTransaction = async (
  id: number,
  from: number,
  type: TransactionTypeList,
  category: number,
  cost: number,
  date: string,
  comment?: string,
  to?: number,
): Promise<APIParsedResponse<TransactionModel>> => {
  const payload: {
    id: number;
    from: number;
    type: TransactionTypeList;
    category: number;
    cost: number;
    date: number;
    comment?: string;
    to?: number;
  } = {
    id,
    from,
    category,
    type,
    cost,
    date: new Date(date).getTime(),
  };

  if (comment) {
    payload.comment = comment;
  }

  if (to) {
    payload.to = to;
  }

  return requestHandler<TransactionModel>(
    api.post('/transaction/update', payload),
  );
};
