import { makeAutoObservable, runInAction } from 'mobx';

import { TransactionFilters } from 'utils/class.utils';
import { PaymentMethodModel } from './payment.method.model';
import { CategoryModel } from './category.model';
import { UserModel } from './user.model';
import { AccountModel } from './account.model';
import {
  createTransaction,
  fetchTransactions,
  updateTransaction,
  removeTransaction,
} from 'api/api.transaction';
import {
  APIErrorList,
  APIParsedResponse,
  NetworkComponentStatusList,
} from 'api/api.handler';

export enum TransactionTypeList {
  All = 'All',
  Income = 'Income',
  Outcome = 'Outcome',
}

export interface TransactionModel {
  id: number | undefined;
  account: AccountModel | undefined;
  user: UserModel | undefined;
  category: CategoryModel | undefined;
  type: TransactionTypeList | undefined;
  cost: number | undefined;
  from: PaymentMethodModel | undefined;
  date: number | undefined;
  to?: PaymentMethodModel | undefined;
  comment: string | undefined;
  createdAt: string | undefined;
  updatedAt?: string | undefined;
}

export class TransactionState implements TransactionModel {
  id: number | undefined;
  account: AccountModel | undefined;
  user: UserModel | undefined;
  category: CategoryModel | undefined;
  type: TransactionTypeList | undefined;
  cost: number | undefined;
  from: PaymentMethodModel | undefined;
  date: number | undefined;
  to?: PaymentMethodModel | undefined;
  comment: string | undefined;
  createdAt: string | undefined;
  updatedAt?: string | undefined;

  constructor() {
    makeAutoObservable(this);
  }

  setState(transaction: TransactionModel) {
    this.id = transaction.id;
    this.account = transaction.account;
    this.user = transaction.user;
    this.category = transaction.category;
    this.type = transaction.type;
    this.cost = transaction.cost;
    this.from = transaction.from;
    this.date = transaction.date;
    this.to = transaction.to;
    this.comment = transaction.comment;
    this.createdAt = transaction.createdAt;
    this.updatedAt = transaction.updatedAt;
  }
}

export class TransactionCollectionState {
  collection: TransactionState[] = [];
  status: NetworkComponentStatusList = NetworkComponentStatusList.Untouched;
  total: number = 0;
  elements: number = 0;
  error: APIErrorList | null = null;
  page: number = 1;

  constructor() {
    makeAutoObservable(this);
  }

  async removeTransaction(id: number): Promise<APIParsedResponse<void>> {
    const result = await removeTransaction(id);

    if (result.success) {
      runInAction(() => {
        this.collection = this.collection.filter(t => t.id !== id);
      });
    }

    return result;
  }

  async updateTransaction(
    id: number,
    from: number,
    type: TransactionTypeList,
    category: number,
    cost: number,
    comment?: string,
    to?: number,
  ): Promise<APIParsedResponse<TransactionModel>> {
    const result = await updateTransaction(
      id,
      from,
      type,
      category,
      cost,
      comment,
      to,
    );

    if (result.success) {
      runInAction(() => {
        if (result.payload) {
          this.collection.find(t => t.id === id)?.setState(result.payload);
        }
      });
    }

    return result;
  }

  async createTransaction(
    from: number,
    type: TransactionTypeList,
    category: number,
    cost: number,
    comment?: string,
    to?: number,
  ): Promise<APIParsedResponse<TransactionModel>> {
    const result = await createTransaction(
      from,
      type,
      category,
      cost,
      Date.now(),
      comment,
      to,
    );

    if (result.success && result.payload) {
      await this.fetchTransactions();
    }

    return result;
  }

  async fetchTransactions(filters?: TransactionFilters) {
    runInAction(() => {
      this.status = NetworkComponentStatusList.Loading;
      this.page = filters?.page ?? this.page;
    });

    const result = await fetchTransactions(
      filters?.page ?? this.page,
      filters?.perPage ?? 30,
      filters?.type,
      filters?.category,
      filters?.dateFrom,
      filters?.dateTo,
      filters?.date,
    );

    if (result.success && result.payload) {
      runInAction(() => {
        this.status = NetworkComponentStatusList.Loaded;
        if (result?.payload) {
          this.total = result.payload.total;
          this.elements = result.payload.elements;
        }

        if (result.payload) {
          this.collection = result.payload.list.map(transaction => {
            const t = new TransactionState();
            t.setState(transaction);

            return t;
          });
        }
      });
    } else {
      runInAction(() => {
        this.status = NetworkComponentStatusList.Failed;
      });
    }

    return result;
  }
}
