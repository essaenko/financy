import { makeAutoObservable, runInAction } from 'mobx';
import {
  createAccount,
  fetchAccount,
  fetchAccountUsers,
  removeUserFromAccount,
} from 'api/api.account';
import {
  APIErrorList,
  APIParsedResponse,
  NetworkComponentStatusList,
} from 'api/api.handler';
import { UserModel } from './user.model';

export interface AccountModel {
  id: number | undefined;
  createdAt: string | undefined;
  updatedAt: string | undefined;
  owner: UserModel | undefined;
  users: UserModel[];
}

export class AccountState implements AccountModel {
  id: number | undefined;
  createdAt: string | undefined;
  updatedAt: string | undefined;
  owner: UserModel | undefined;
  users: UserModel[] = [];
  status: NetworkComponentStatusList = NetworkComponentStatusList.Untouched;
  error: APIErrorList | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  private setAccountData(account: AccountModel) {
    runInAction(() => {
      this.status = NetworkComponentStatusList.Loaded;
      this.id = account.id;
      this.createdAt = account.createdAt;
      this.updatedAt = account.updatedAt;
      this.owner = account.owner;
    });
  }

  private handleResponse(response: APIParsedResponse<AccountModel>) {
    if (response.success && response.payload) {
      this.setAccountData(response.payload);
      this.fetchAccountUsers();
    } else {
      runInAction(() => {
        this.status = NetworkComponentStatusList.Failed;
        if (response.errorCode) {
          this.error = APIErrorList[response.errorCode];
        }
      });
    }
  }

  async fetchAccount() {
    runInAction(() => {
      this.status = NetworkComponentStatusList.Loading;
      this.error = null;
    });

    this.handleResponse(await fetchAccount());
  }

  async createAccount(): Promise<APIParsedResponse<AccountModel>> {
    const result = await createAccount();
    this.handleResponse(result);

    return result;
  }

  async fetchAccountUsers() {
    const result = await fetchAccountUsers();

    if (result.success && result.payload) {
      runInAction(() => {
        this.users = result.payload ?? [];
      });
    }
  }

  async removeUserFromAccount(email: string) {
    const result = await removeUserFromAccount(email);

    if (result.success) {
      await this.fetchAccount();
      await this.fetchAccountUsers();
    }

    return result;
  }
}
