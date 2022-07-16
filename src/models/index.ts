import { UserState } from './user.model';
import { AccountState } from './account.model';
import { CategoryCollectionState } from './category.model';
import { PaymentMethodCollectionState } from './payment.model';
import { TransactionCollectionState } from './transaction.model';
import { StatsCollectionState } from './stats.model';
import { FamilyRequestCollectionState } from './familyrequest.model';

export const state = {
  user: new UserState(),
  account: new AccountState(),
  categories: new CategoryCollectionState(),
  payment: new PaymentMethodCollectionState(),
  transaction: new TransactionCollectionState(),
  stats: new StatsCollectionState(),
  family: new FamilyRequestCollectionState(),
};
