import { APIParsedResponse, requestHandler } from './api.handler'
import { api } from './api.transport'
import { AccountModel } from '../models/AccountModel'

export const fetchAccount = async (): Promise<
  APIParsedResponse<AccountModel>
> => {
  return await requestHandler<AccountModel>(await api.get('/account'))
}

export const createAccount = async (): Promise<
  APIParsedResponse<AccountModel>
> => {
  return await requestHandler<AccountModel>(await api.post('/account/create'))
}
