import { APIParsedResponse, requestHandler } from './api.handler'
import { api } from './api.transport'
import { AUTH_TOKEN_LOCAL_STORAGE_KEY } from '../globals.config'
import { UserModel } from '../models/user.model'

export const loginUser = async (
  email: string,
  password: string
): Promise<APIParsedResponse<{ token: string }>> => {
  const result = await requestHandler<{ token: string }>(
    api.post('/user/login', { email, password })
  )

  if (result.success && result.payload?.token) {
    await api.useToken(result.payload.token)
    localStorage.setItem(AUTH_TOKEN_LOCAL_STORAGE_KEY, result.payload.token)
  }

  return result
}

export const fetchUser = async (): Promise<APIParsedResponse<UserModel>> => {
  return await requestHandler<UserModel>(api.get('/user'))
}

export const createUser = async (
  email: string,
  name: string,
  password: string
): Promise<APIParsedResponse<void>> => {
  return await requestHandler<void>(
    api.post('/user/create', { email, name, password })
  )
}
