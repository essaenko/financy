import { APIParsedResponse, requestHandler } from './api.handler';
import { api } from './api.transport';
import { AUTH_TOKEN_LOCAL_STORAGE_KEY } from '../globals.config';
import { UserModel } from '../models/user.model';

export const restorePassword = async (
  email: string,
): Promise<APIParsedResponse> => {
  const result = await requestHandler(api.post('/user/restore', { email }));

  if (result.success) {
    await api.removeToken();
  }

  return result;
};

export const resetPassword = async (
  password: string,
  token: string,
): Promise<APIParsedResponse> => {
  const result = await requestHandler(
    api.post('/user/reset', { password, token }),
  );

  if (result.success) {
    await api.removeToken();
  }

  return result;
};

export const updatePassword = async (
  currentPassword: string,
  newPassword: string,
): Promise<APIParsedResponse> =>
  requestHandler(api.post('/user/change', { currentPassword, newPassword }));

export const loginUser = async (
  email: string,
  password: string,
): Promise<APIParsedResponse<{ token: string }>> => {
  const result = await requestHandler<{ token: string }>(
    api.post('/user/login', { email, password }),
  );

  if (result.success && result.payload?.token) {
    await api.useToken(result.payload.token);
    localStorage.setItem(AUTH_TOKEN_LOCAL_STORAGE_KEY, result.payload.token);
  }

  return result;
};

export const fetchUser = async (): Promise<APIParsedResponse<UserModel>> => {
  return requestHandler<UserModel>(api.get('/user'));
};

export const createUser = async (
  email: string,
  name: string,
  password: string,
): Promise<APIParsedResponse<void>> => {
  return requestHandler<void>(
    api.post('/user/create', { email, name, password }),
  );
};
