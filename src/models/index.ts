import { UserState } from './user.model';
import { AccountState } from './account.model';
import { CategoryCollectionState } from './category.model';
import { PaymentMethodCollectionState } from './payment.method.model';
import { TransactionCollectionState } from './transaction.model';
import { StatsCollectionState } from './stats.model';
import { FamilyRequestCollectionState } from './familyrequest.model';
import { PaymentAccountCollectionState } from 'models/payment.account.model';

export const state = {
  user: new UserState(),
  account: new AccountState(),
  categories: new CategoryCollectionState(),
  payment: {
    account: new PaymentAccountCollectionState(),
    method: new PaymentMethodCollectionState(),
  },
  transaction: new TransactionCollectionState(),
  stats: new StatsCollectionState(),
  family: new FamilyRequestCollectionState(),
};
