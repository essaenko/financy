import { makeAutoObservable, runInAction } from 'mobx';
import { NetworkComponentStatusList } from '../api/api.handler';
import {
  approveFamilyRequest,
  createFamilyRequest,
  fetchFamilyRequest,
  fetchFamilyRequests,
  rejectFamilyRequest,
} from '../api/api.familyrequest';

export interface FamilyRequestModel {
  id: number | undefined;
  createdAt: string | undefined;
  updatedAt: string | undefined;
  user: string | undefined;
  account: number | undefined;
  owner: string | undefined;
  isActive: boolean | undefined;
}

export class FamilyRequestState implements FamilyRequestModel {
  id: number | undefined;
  createdAt: string | undefined;
  updatedAt: string | undefined;
  user: string | undefined;
  account: number | undefined;
  owner: string | undefined;
  isActive: boolean | undefined;

  constructor() {
    makeAutoObservable(this);
  }

  setState(model: FamilyRequestModel) {
    this.id = model.id;
    this.user = model.user;
    this.account = model.account;
    this.createdAt = model.createdAt;
    this.updatedAt = model.updatedAt;
    this.owner = model.owner;
    this.isActive = model.isActive;
  }

  async approveRequest() {
    await approveFamilyRequest(this.id as number);
  }

  async rejectRequest() {
    await rejectFamilyRequest(this.id as number);
  }
}

export class FamilyRequestCollectionState {
  collection: FamilyRequestState[] = [];
  status: NetworkComponentStatusList = NetworkComponentStatusList.Untouched;

  constructor() {
    makeAutoObservable(this);
  }

  async createFamilyRequest(email: string) {
    runInAction(() => {
      this.status = NetworkComponentStatusList.Loading;
    });

    const request = await createFamilyRequest(email);

    if (request.success) {
      runInAction(() => {
        if (request.payload) {
          this.status = NetworkComponentStatusList.Loaded;
          this.collection = [new FamilyRequestState()];
          this.collection[0].setState(request.payload);
        }
      });
    } else {
      runInAction(() => {
        this.status = NetworkComponentStatusList.Failed;
      });
    }
  }

  async fetchFamilyRequest() {
    runInAction(() => {
      this.status = NetworkComponentStatusList.Loading;
    });

    const result = await fetchFamilyRequest();

    if (result.success) {
      runInAction(() => {
        if (result.payload) {
          this.status = NetworkComponentStatusList.Loaded;
          this.collection = [new FamilyRequestState()];
          this.collection[0].setState(result.payload);
        }
      });
    } else {
      runInAction(() => {
        this.status = NetworkComponentStatusList.Failed;
      });
    }
  }

  async fetchFamilyRequests() {
    runInAction(() => {
      this.status = NetworkComponentStatusList.Loading;
    });

    const result = await fetchFamilyRequests();

    if (result.success && result.payload) {
      runInAction(() => {
        this.status = NetworkComponentStatusList.Loaded;
        this.collection =
          result.payload?.map(model => {
            const request = new FamilyRequestState();
            request.setState(model);

            return request;
          }) ?? [];
      });
    } else {
      runInAction(() => {
        this.status = NetworkComponentStatusList.Failed;
      });
    }
  }
}
