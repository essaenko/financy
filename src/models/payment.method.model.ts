import { makeAutoObservable, runInAction } from 'mobx';
import {
  createPaymentMethod,
  fetchPaymentMethods,
  removePaymentMethod,
  updatePaymentMethod,
} from 'api/api.payment';
import { APIParsedResponse, NetworkComponentStatusList } from 'api/api.handler';
import { PaymentAccountModel } from 'models/payment.account.model';
import { UserModel } from 'models/user.model';

export interface PaymentMethodModel {
  id: number | undefined;
  account: PaymentAccountModel | undefined;
  owner: UserModel | undefined;
  name: string | undefined;
  description: string | undefined;
  remains: number | undefined;
  createdAt: string | undefined;
  updatedAt: string | undefined;
}

export class PaymentMethodState implements PaymentMethodModel {
  id: number | undefined;
  account: PaymentAccountModel | undefined;
  owner: UserModel | undefined;
  name: string | undefined;
  description: string | undefined;
  remains: number | undefined;
  createdAt: string | undefined;
  updatedAt: string | undefined;

  constructor() {
    makeAutoObservable(this);
  }

  setState(payment: PaymentMethodModel) {
    this.id = payment.id;
    this.account = payment.account;
    this.name = payment.name;
    this.description = payment.description;
    this.owner = payment.owner;
    this.createdAt = payment.createdAt;
    this.updatedAt = payment.updatedAt;
  }
}

export class PaymentMethodCollectionState {
  collection: PaymentMethodState[] = [];
  status: NetworkComponentStatusList = NetworkComponentStatusList.Untouched;

  constructor() {
    makeAutoObservable(this);
  }

  async removePayment(id: number): Promise<APIParsedResponse<void>> {
    const result = await removePaymentMethod(id);

    if (result.success) {
      runInAction(() => {
        this.collection = this.collection.filter(p => p.id !== id);
      });
    }

    return result;
  }

  async createPayment(
    account: number,
    name: string,
    description: string,
  ): Promise<APIParsedResponse<PaymentMethodModel>> {
    const result = await createPaymentMethod(account, name, description);

    if (result.success && result.payload) {
      await this.fetchPaymentMethods();
    }

    return result;
  }

  async updatePayment(
    id: number,
    name: string,
    description: string,
  ): Promise<APIParsedResponse<PaymentMethodModel>> {
    const result = await updatePaymentMethod(id, name, description);

    if (result.success) {
      runInAction(() => {
        if (result.payload) {
          this.collection.find(p => p.id === id)?.setState(result.payload);
        }
      });
    }

    return result;
  }

  async fetchPaymentMethods(): Promise<
    APIParsedResponse<PaymentMethodModel[]>
  > {
    runInAction(() => {
      this.status = NetworkComponentStatusList.Loading;
    });

    const result = await fetchPaymentMethods();

    if (result.success && result.payload) {
      runInAction(() => {
        this.status = NetworkComponentStatusList.Loaded;
        this.collection =
          result.payload?.map(payment => {
            const instance = new PaymentMethodState();
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
