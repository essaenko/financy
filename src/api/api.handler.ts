import { api } from './api.transport';

export interface APIParsedResponse<T = unknown> {
  success?: true;
  error?: true;
  payload?: T;
  errorCode?: APIErrorList;
}

export interface CollectionResponse<T> {
  total: number;
  elements: number;
  list: T;
}

export enum NetworkComponentStatusList {
  Untouched,
  Loading,
  Loaded,
  Failed,
}

export enum APIResponseStatusList {
  Ok = 'Ok',
  Error = 'Error',
}

export enum APIErrorList {
  UnauthorizedException = 'UnauthorizedException',
  UserNotFountException = 'UserNotFountException',
  NoUserAccountException = 'NoUserAccountException',
  InvalidResponseException = 'InvalidResponseException',
  ServiceUnreachableException = 'ServiceUnreachableException',
  InternalServerException = 'InternalServerException',
  EmailAlreadyRegisteredException = 'EmailAlreadyRegisteredException',
}

export interface APIResponse<T> {
  status?: APIResponseStatusList;
  error?: keyof typeof APIErrorList;
  payload?: T;
}

const parseResponse = async <T>(
  response: Response,
): Promise<APIParsedResponse<T>> => {
  try {
    const json: APIResponse<T> = await response.json();

    if (json.status === APIResponseStatusList.Error) {
      return {
        error: true,
        errorCode: APIErrorList[json.error as APIErrorList],
      };
    }

    return {
      success: true,
      payload: json.payload,
    };
  } catch (e) {
    return {
      error: true,
      errorCode: APIErrorList.InvalidResponseException,
    };
  }
};

export const requestHandler = async <T extends unknown>(
  request: Promise<Response>,
): Promise<APIParsedResponse<T>> => {
  try {
    const response = await request;
    if (response.status !== 200) {
      if (response.status === 401) {
        api.removeToken();

        return {
          error: true,
          errorCode: APIErrorList.UnauthorizedException,
        };
      }

      if (response.status === 404) {
        return {
          error: true,
          errorCode: APIErrorList.ServiceUnreachableException,
        };
      }

      return {
        error: true,
        errorCode: APIErrorList.UserNotFountException,
      };
    }

    return parseResponse(response);
  } catch (e) {
    return {
      error: true,
      errorCode: APIErrorList.ServiceUnreachableException,
    };
  }
};
