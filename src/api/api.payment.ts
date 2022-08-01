import { APIParsedResponse, requestHandler } from './api.handler';
import { api } from './api.transport';
import { PaymentMethodModel } from 'models/payment.method.model';
import { PaymentAccountModel } from 'models/payment.account.model';

export const fetchPaymentMethods = async (): Promise<
  APIParsedResponse<PaymentMethodModel[]>
> => {
  return requestHandler<PaymentMethodModel[]>(api.get('/payment/method'));
};

export const fetchPaymentAccounts = async (): Promise<
  APIParsedResponse<PaymentAccountModel[]>
> => {
  return requestHandler<PaymentAccountModel[]>(api.get('/payment/account'));
};

export const updatePaymentMethod = async (
  id: number,
  name: string,
  description: string,
): Promise<APIParsedResponse<PaymentMethodModel>> => {
  return requestHandler<PaymentMethodModel>(
    api.post('/payment/method/update', {
      id,
      name,
      description,
    }),
  );
};

export const updatePaymentAccount = async (
  id: number,
  name: string,
  description: string,
  remains: number,
): Promise<APIParsedResponse<PaymentAccountModel>> => {
  return requestHandler<PaymentAccountModel>(
    api.post('/payment/account/update', {
      id,
      name,
      description,
      remains,
    }),
  );
};

export const removePaymentMethod = async (
  id: number,
): Promise<APIParsedResponse<void>> => {
  return requestHandler<void>(
    api.post('/payment/method/remove', {
      id,
    }),
  );
};

export const removePaymentAccount = async (
  id: number,
): Promise<APIParsedResponse<void>> => {
  return requestHandler<void>(
    api.post('/payment/account/remove', {
      id,
    }),
  );
};

export const createPaymentMethod = async (
  account: number,
  name: string,
  description: string,
): Promise<APIParsedResponse<PaymentMethodModel>> => {
  return requestHandler<PaymentMethodModel>(
    api.post('/payment/method/create', {
      account,
      name,
      description,
    }),
  );
};

export const createPaymentAccount = async (
  name: string,
  description: string,
  remains: number,
): Promise<APIParsedResponse<PaymentAccountModel>> => {
  return requestHandler<PaymentAccountModel>(
    api.post('/payment/account/create', {
      name,
      description,
      remains,
    }),
  );
};
