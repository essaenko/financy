import {makeAutoObservable, runInAction} from "mobx";

import { PaymentMethodModel } from './payment.model'
import { CategoryModel } from './category.model'
import { UserModel } from './user.model'
import { AccountModel } from './account.model'
import {createTransaction, fetchTransactions, updateTransaction, removeTransaction} from "../api/api.transaction";
import {APIParsedResponse} from "../api/api.handler";

export enum TransactionTypeList {
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

export class TransactionState implements TransactionModel{
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
    makeAutoObservable(this)
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
  loaded: boolean = false;
  loading: boolean = false;
  page: number = 1;

  constructor() {
    makeAutoObservable(this);
  }

  async removeTransaction(
    id: number,
  ): Promise<APIParsedResponse<void>> {
    const result = await removeTransaction(id);

    if (result.success) {
      runInAction(() => {
        this.collection = this.collection.filter((t) => t.id !== id);
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

    if (result.success && result.payload) {
      runInAction(() => {
        this.collection.find((t) => t.id === id)?.setState(result.payload!);
      })
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
      await this.fetchTransactions(this.page);
    }

    return result;
  }

  async fetchTransactions(page: number = 1) {
    runInAction(() => {
      this.loaded = false;
      this.loading = true;
      this.page = page;
    })

    const result = await fetchTransactions(page);

    if (result.success && result.payload) {
      runInAction(() => {
        this.loaded = true;
        this.loading = false;

        this.collection = result.payload!.map((transaction) => {
          const t = new TransactionState();
          t.setState(transaction);

          return t;
        });
      })
    } else {
      runInAction(() => {
        this.loading = false;
        this.loaded = false
      })
    }

    return result
  }
}
