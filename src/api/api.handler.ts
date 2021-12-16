export interface APIParsedResponse<T> {
  success?: true,
  error?: true,
  payload?: T
}

export enum APIResponseStatusList {
  Ok,
  Error
}

export interface APIResponse<T> {
  status: APIResponseStatusList,
  payload?: T,
}

export const requestHandler = async <T = any>(response: Response): Promise<APIParsedResponse<T>> => {
  if (response.status !== 200) {
    return {
      error: true,
    }
  }

  try {
    const json: APIResponse<T> = await response.json();

    if (json.status === APIResponseStatusList.Error) {
      return {
        error: true,
        payload: json.payload,
      }
    }

    return {
      success: true,
      payload: json.payload,
    }
  } catch (e) {
    return {
      error: true,
    }
  }
}