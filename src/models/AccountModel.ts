import {makeAutoObservable, runInAction} from "mobx";
import {createAccount, fetchAccount} from "../api/api.account";
import {APIParsedResponse} from "../api/api.handler";

export interface AccountModel {
  id: number | undefined
  createdAt: string | undefined
  updatedAt: string | undefined
}

export class AccountState implements AccountModel {
  id: number | undefined
  createdAt: string | undefined
  updatedAt: string | undefined

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

  async createAccount() {
    this.handleResponse(await createAccount())
  }
}