import {makeAutoObservable, runInAction} from "mobx";
import {createAccount, fetchAccount, fetchAccountUsers} from "../api/api.account";
import {APIParsedResponse} from "../api/api.handler";
import {UserModel} from "./user.model";

export interface AccountModel {
  id: number | undefined
  createdAt: string | undefined
  updatedAt: string | undefined
  owner: UserModel | undefined
  users: UserModel[]
}

export class AccountState implements AccountModel {
  id: number | undefined
  createdAt: string | undefined
  updatedAt: string | undefined
  owner: UserModel | undefined
  users: UserModel[] = []

  loading: boolean = false
  loaded: boolean = false
  error: string = ""

  constructor() {
    makeAutoObservable(this)
  }

  private setAccountData(account: AccountModel) {
    runInAction(() => {
      this.id = account.id
      this.createdAt = account.createdAt
      this.updatedAt = account.updatedAt
      this.owner = account.owner

      this.loading = false
      this.loaded = true
      this.error = ""
    })
  }

  private handleResponse(response: APIParsedResponse<AccountModel>) {
    if (response.success && response.payload) {
      this.setAccountData(response.payload)
    } else {
      runInAction(() => {
        this.loading = false
        this.loaded = false
        this.error = response.errorCode?.toString() || ""
      })
    }
  }

  async fetchAccount() {
    runInAction(() => {
      this.loading = true
      this.loaded = false
      this.error = ""
    })

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
      })
    }
  }
}