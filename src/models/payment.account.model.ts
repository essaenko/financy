import { AccountModel } from 'models/account.model';
import { makeAutoObservable, runInAction } from 'mobx';
import { APIParsedResponse, NetworkComponentStatusList } from 'api/api.handler';
import {
  createPaymentAccount,
  fetchPaymentAccounts,
  removePaymentAccount,
  updatePaymentAccount,
} from 'api/api.payment';

export interface PaymentAccountModel {
  id: number | undefined;
  account: AccountModel | undefined;
  name: string | undefined;
  description: string | undefined;
  remains: number | undefined;
  createdAt: string | undefined;
  updatedAt: string | undefined;
}

export class PaymentAccountState implements PaymentAccountModel {
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

  setState(payment: PaymentAccountModel) {
    this.id = payment.id;
    this.account = payment.account;
    this.name = payment.name;
    this.description = payment.description;
    this.remains = payment.remains;
    this.createdAt = payment.createdAt;
    this.updatedAt = payment.updatedAt;
  }
}

export class PaymentAccountCollectionState {
  collection: PaymentAccountState[] = [];
  status: NetworkComponentStatusList = NetworkComponentStatusList.Untouched;

  constructor() {
    makeAutoObservable(this);
  }

  async removePayment(id: number): Promise<APIParsedResponse<void>> {
    const result = await removePaymentAccount(id);

    if (result.success) {
      runInAction(() => {
        this.collection = this.collection.filter(p => p.id !== id);
      });
    }

    return result;
  }

  async createPayment(
    name: string,
    description: string,
    remains: number,
  ): Promise<APIParsedResponse<PaymentAccountModel>> {
    const result = await createPaymentAccount(name, description, remains);

    if (result.success && result.payload) {
      await this.fetchPaymentAccounts();
    }

    return result;
  }

  async updatePayment(
    id: number,
    name: string,
    description: string,
    remains: number,
  ): Promise<APIParsedResponse<PaymentAccountModel>> {
    const result = await updatePaymentAccount(id, name, description, remains);

    if (result.success) {
      runInAction(() => {
        if (result.payload) {
          this.collection.find(p => p.id === id)?.setState(result.payload);
        }
      });
    }

    return result;
  }

  async fetchPaymentAccounts(): Promise<
    APIParsedResponse<PaymentAccountModel[]>
  > {
    runInAction(() => {
      this.status = NetworkComponentStatusList.Loading;
    });

    const result = await fetchPaymentAccounts();

    if (result.success && result.payload) {
      runInAction(() => {
        this.status = NetworkComponentStatusList.Loaded;
        this.collection =
          result.payload?.map(payment => {
            const instance = new PaymentAccountState();
            instance.setState(payment);

            return instance;
          }) || [];
      });

      return result;
    }

    runInAction(() => {
      this.status = NetworkComponentStatusList.Failed;
    });

    return result;
  }
}
