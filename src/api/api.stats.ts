import { StatsCollectionModel } from 'models/stats.model';
import { APIParsedResponse, requestHandler } from './api.handler';
import { api } from './api.transport';
import { TransactionTypeList } from '../models/transaction.model';

export const fetchStatsData = async (
  dateFrom: Date,
  dateTo: Date,
  type: TransactionTypeList,
  category: number,
  user: number,
): Promise<APIParsedResponse<StatsCollectionModel>> => {
  return requestHandler<StatsCollectionModel>(
    api.get('/stats', {
      dateFrom: dateFrom.getTime(),
      dateTo: dateTo.getTime(),
      type,
      category,
      user,
    }),
  );
};
