import { makeAutoObservable, runInAction } from 'mobx';
import { NetworkComponentStatusList } from 'api/api.handler';
import { TransactionTypeList } from './transaction.model';
import { fetchStatsData } from 'api/api.stats';

export interface StatsBatchModel {
  date: string;
  value: number;
  key?: number;
}

export interface StatsCollectionModel {
  income: StatsBatchModel[] | null;
  outcome: StatsBatchModel[] | null;
  remains: StatsBatchModel[] | null;
  structure: Record<number, number>;
}

export class StatsBatchState implements StatsBatchModel {
  date: string = '';
  value: number = 0;
  key?: number;

  constructor() {
    makeAutoObservable(this);
  }

  setState(batch: StatsBatchModel) {
    this.date = batch.date;
    this.value = batch.value;
    if (batch.key) {
      this.key = batch.key;
    }
  }
}

export class StatsCollectionState implements StatsCollectionModel {
  income: StatsBatchState[] = [];
  outcome: StatsBatchState[] = [];
  remains: StatsBatchState[] = [];
  structure: Record<number, number> = [];
  status: NetworkComponentStatusList = NetworkComponentStatusList.Untouched;

  constructor() {
    makeAutoObservable(this);
  }

  async fetchStatsData(
    dateFrom: Date,
    dateTo: Date,
    type: TransactionTypeList,
    category: number,
    user: number,
  ) {
    runInAction(() => {
      this.status = NetworkComponentStatusList.Loading;
    });
    const result = await fetchStatsData(dateFrom, dateTo, type, category, user);

    if (result.success && result.payload) {
      runInAction(() => {
        this.status = NetworkComponentStatusList.Loaded;
      });
      runInAction(() => {
        if (result.payload?.income) {
          this.income = result.payload.income.map(model => {
            const state = new StatsBatchState();
            state.setState(model);

            return state;
          });
        } else {
          this.income = [];
        }
      });
      runInAction(() => {
        if (result.payload?.outcome) {
          this.outcome = result.payload.outcome.map(model => {
            const state = new StatsBatchState();
            state.setState(model);

            return state;
          });
        } else {
          this.outcome = [];
        }
      });
      runInAction(() => {
        if (result.payload?.remains) {
          this.remains = result.payload.remains.map(model => {
            const state = new StatsBatchState();
            state.setState(model);

            return state;
          });
        } else {
          this.remains = [];
        }
      });
      runInAction(() => {
        if (result.payload?.structure) {
          this.structure = result.payload.structure;
        }
      });
    } else {
      runInAction(() => {
        this.status = NetworkComponentStatusList.Failed;
      });
    }
  }
}
