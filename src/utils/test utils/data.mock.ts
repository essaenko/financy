import { TransactionTypeList } from 'models/transaction.model';
import { CategoryTypeList } from 'models/category.model';

export const defaultUserMock = {
  id: 1,
  name: 'Dafault User',
  email: 'default@example.com',
  createdAt: new Date('01.01.2022').getTime(),
  updatedAt: undefined,
};

export const defaultAccountMock = {
  id: 1,
  createdAt: new Date('01.01.2022').getTime(),
  updatedAt: undefined,
  owner: defaultUserMock,
  users: [],
};

export const defaultCategoryMock = {
  id: 1,
  parent: undefined,
  account: defaultAccountMock,
  name: 'Default category name',
  mcc: undefined,
  type: CategoryTypeList.Income,
  createdAt: new Date('01.01.2022').getTime(),
  updatedAt: undefined,
};

export const defaultPaymentMethodMock = {
  id: 1,
  account: defaultAccountMock,
  owner: defaultUserMock,
  name: 'Default payment method name',
  description: 'Default payment method',
  remains: 1000,
  createdAt: new Date('01.01.2022').getTime(),
  updatedAt: undefined,
};

export const defaultTransactionMock = {
  id: 1,
  account: defaultAccountMock,
  user: defaultUserMock,
  category: defaultCategoryMock,
  type: TransactionTypeList.Income,
  cost: 10,
  from: defaultPaymentMethodMock,
  date: new Date('01.02.2022').getTime(),
  comment: 'Default income transaction',
  createdAt: new Date('01.01.2022').getTime(),
  updatedAt: undefined,
};
