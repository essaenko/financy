export interface APIParsedResponse<T = any> {
  success?: true;
  error?: true;
  payload?: T;
  errorCode?: string;
}

export enum APIResponseStatusList {
  Ok = 'Ok',
  Error = 'Error',
}

export enum APIErrorList {
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
  try {
    const response = await request;
    if (response.status !== 200) {
      return {
        error: true,
        errorCode: APIErrorList.UserNotFountException,
      }
    }

    return parseResponse(response);
  } catch (e: any) {
    if (e.status === void 0) {
      return {
        error: true,
        errorCode: APIErrorList.ServiceUnreachableException,
      }
    } else {
      return {error: true}
    }
  }

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
