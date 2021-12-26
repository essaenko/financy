import { APIParsedResponse, requestHandler } from './api.handler'
import { api } from './api.transport'
import { AccountModel } from '../models/account.model'
import { UserModel } from '../models/user.model'

export const fetchAccount = async (): Promise<
  APIParsedResponse<AccountModel>
> => {
  return await requestHandler<AccountModel>(api.get('/account'))
}

export const createAccount = async (): Promise<
  APIParsedResponse<AccountModel>
> => {
  return await requestHandler<AccountModel>(api.post('/account/create'))
}

export const fetchAccountUsers = async (): Promise<
  APIParsedResponse<UserModel[]>
> => {
  return await requestHandler<UserModel[]>(api.get('/account/users'))
}
