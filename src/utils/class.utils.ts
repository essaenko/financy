import { TransactionTypeList } from '../models/transaction.model';

export enum DateIntervalList {
  Day = 'Day',
  Month = 'Month',
  Year = 'Year',
}

export class TransactionFilters {
  readonly type: TransactionTypeList;
  readonly dateFrom: number | undefined;
  readonly dateTo: number | undefined;
  readonly date: number | undefined;
  readonly category: number | undefined;
  readonly page: number;
  readonly perPage: number;

  constructor(
    page = 1,
    perPage = 20,
    type?: TransactionTypeList,
    category?: number,
    dateFrom?: number,
    dateTo?: number,
    date?: number,
  ) {
    this.type = type ?? TransactionTypeList.All;
    this.dateFrom = dateFrom;
    this.dateTo = dateTo;
    this.date = date;
    this.category = category;
    this.page = page;
    this.perPage = perPage;
  }
}
