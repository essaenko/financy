import { APIParsedResponse, requestHandler } from './api.handler';
import { api } from './api.transport';
import { PaymentMethodModel } from '../models/payment.model';

export const fetchPaymentMethods = async (): Promise<
  APIParsedResponse<PaymentMethodModel[]>
> => {
  return requestHandler<PaymentMethodModel[]>(api.get('/payment'));
};

export const updatePaymentMethod = async (
  id: number,
  name: string,
  description: string,
  remains: number,
): Promise<APIParsedResponse<PaymentMethodModel>> => {
  return requestHandler<PaymentMethodModel>(
    api.post('/payment/update', {
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
    api.post('/payment/remove', {
      id,
    }),
  );
};

export const createPaymentMethod = async (
  name: string,
  description: string,
  remains: number,
): Promise<APIParsedResponse<PaymentMethodModel>> => {
  return requestHandler<PaymentMethodModel>(
    api.post('/payment/create', {
      name,
      description,
      remains,
    }),
  );
};
