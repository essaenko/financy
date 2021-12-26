import { makeAutoObservable, runInAction } from 'mobx'
import {AccountModel} from "./account.model";
import {createPaymentMethod, fetchPaymentMethods, removePaymentMethod, updatePaymentMethod} from "../api/api.payment";
import {APIParsedResponse} from "../api/api.handler";

export interface PaymentMethodModel {
  id: number | undefined
  account: AccountModel | undefined,
  name: string | undefined,
  description: string | undefined,
  remains: number | undefined,
  createdAt: string | undefined,
  updatedAt: string | undefined,
}

export class PaymentMethodState implements PaymentMethodModel {
  id: number | undefined;
  account: AccountModel | undefined;
  name: string | undefined;
  description: string | undefined;
  remains: number | undefined;
  createdAt: string | undefined;
  updatedAt: string | undefined;

  constructor() {
    makeAutoObservable(this);
  }

  setState(payment: PaymentMethodModel) {
    this.id = payment.id
    this.account = payment.account
    this.name = payment.name
    this.description = payment.description
    this.remains = payment.remains
    this.createdAt = payment.createdAt
    this.updatedAt = payment.updatedAt
  }
}

export class PaymentMethodCollectionState {
  collection: PaymentMethodState[] = [];
  loading: boolean = false;
  loaded: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  async removePayment(id: number): Promise<APIParsedResponse<void>> {
    const result = await removePaymentMethod(id);

    if (result.success) {
      runInAction(() => {
        this.collection = this.collection.filter((p) => p.id !== id);
      });
    }

    return result;
  }

  async createPayment(name: string, description: string, remains: number):
    Promise<APIParsedResponse<PaymentMethodModel>>
  {
    const result = await createPaymentMethod(name, description, remains);

    if (result.success && result.payload) {
      await this.fetchPaymentMethods();
    }

    return result;
  }

  async updatePayment(id: number, name: string, description: string, remains: number):
    Promise<APIParsedResponse<PaymentMethodModel>>
  {
    const result = await updatePaymentMethod(id, name, description, remains);

    if (result.success && result.payload) {
      runInAction(() => {
        this.collection.find((p) => p.id === id)?.setState(result.payload!);
      })
    }

    return result;
  }

  async fetchPaymentMethods(): Promise<APIParsedResponse<PaymentMethodModel[]>> {
    runInAction(() => {
      this.loading = true;
      this.loaded = false;
    });

    const result = await fetchPaymentMethods();

    if (result.success && result.payload) {
      runInAction(() => {
        this.loading = false;
        this.loaded = true;
        this.collection = result.payload?.map((payment) => {
          const instance = new PaymentMethodState();
          instance.setState(payment);

          return instance;
        }) || [];
      });

      return result
    } else {
      runInAction(() => {
        this.loading = false;
        this.loaded = false;
      });

      return result
    }
  }
}
