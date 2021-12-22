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
}

export interface APIResponse<T> {
  status?: APIResponseStatusList;
  error?: keyof typeof APIErrorList;
  payload?: T;
}

export const requestHandler = async <T = any>(
  response: Response
): Promise<APIParsedResponse<T>> => {
  if (response.status !== 200) {
    return {
      error: true,
      errorCode: APIErrorList.UserNotFountException,
    }
  }

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
