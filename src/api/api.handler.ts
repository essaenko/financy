import {api} from "./api.transport";

export interface APIParsedResponse<T = any> {
  success?: true;
  error?: true;
  payload?: T;
  errorCode?: APIErrorList;
}

export interface CollectionResponse<T> {
  total: number,
  elements: number,
  list: T,
}

export enum NetworkComponentStatusList {
  Untouched,
  Loading,
  Loaded,
  Failed
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
}

export interface APIResponse<T> {
  status?: APIResponseStatusList;
  error?: keyof typeof APIErrorList;
  payload?: T;
}

export const requestHandler = async <T = any>(
  request: Promise<Response>
): Promise<APIParsedResponse<T>> => {
  const response = await request;
  if (response.status !== 200) {
    if (response.status === 401) {
      api.removeToken();

      return {
        error: true,
        errorCode: APIErrorList.UnauthorizedException,
      }
    }

    return {
      error: true,
      errorCode: APIErrorList.UserNotFountException,
    }
  }

  return parseResponse(response);
}

const parseResponse = async <T>(response: Response): Promise<APIParsedResponse<T>> => {
  try {
    const json: APIResponse<T> = await response.json()

    if (json.status === APIResponseStatusList.Error) {
      return {
        error: true,
        errorCode: APIErrorList[json.error!!],
      }
    }

    return {
      success: true,
      payload: json.payload,
    }
  } catch (e) {
    return {
      error: true,
      errorCode: APIErrorList.InvalidResponseException,
    }
  }
}
