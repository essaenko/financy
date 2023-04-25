import { makeAutoObservable, runInAction } from 'mobx';

import {
  loginUser,
  fetchUser,
  createUser,
  restorePassword,
  resetPassword,
  updatePassword,
} from 'api/api.user';
import { APIParsedResponse } from 'api/api.handler';

export interface UserModel {
  id: string | undefined;
  name: string | undefined;
  email: string | undefined;
  createdAt: string | undefined;
  updatedAt: string | undefined;
}

export class UserState implements UserModel {
  id: string | undefined;
  name: string | undefined;
  email: string | undefined;
  createdAt: string | undefined;
  updatedAt: string | undefined;

  constructor() {
    makeAutoObservable(this);
  }

  async restorePassword(email: string) {
    return restorePassword(email);
  }

  async resetPassword(password: string, token: string) {
    return resetPassword(password, token);
  }

  async updatePassword(currentPassword: string, newPassowrd: string) {
    return updatePassword(currentPassword, newPassowrd);
  }

  async loginUser(email: string, password: string) {
    const result = await loginUser(email, password);

    if (result.success) {
      await this.fetchUser();
    }

    return result;
  }

  async createUser(email: string, name: string, password: string) {
    const result = await createUser(email, name, password);

    if (result.success) {
      await this.loginUser(email, password);
    }

    return result;
  }

  async fetchUser(): Promise<APIParsedResponse<UserModel>> {
    const result = await fetchUser();

    if (result.success) {
      const { payload } = result;

      runInAction(() => {
        this.id = payload?.id;
        this.name = payload?.name;
        this.email = payload?.email;
        this.createdAt = payload?.createdAt;
        this.updatedAt = payload?.updatedAt;
      });
    }

    return result;
  }
}
