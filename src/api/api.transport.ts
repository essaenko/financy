class Api {
  private endpoint: string = '/api/v1';
  private defaultHeaders: Record<string, string> = {};

  private fabric = (url: string, body?: BodyInit | null, headers?: HeadersInit) => {
    return fetch(url, {
      body,
      headers: {
        ...(this.defaultHeaders),
        ...headers
      }
    });
  }

  private objectToQuery = (params: Record<string, string | number | boolean | null>): string => {
    const keys: string[] = Object.keys(params);

    return keys.reduce((result, key, index) => {
      result += `${index > 0 && '&'}${key}=${params[key]}`

      return result;
    }, '');
  }

  public get = async (path: string, params?: Record<string, string | number | boolean | null>, headers?: Record<string, string>): Promise<Response> => {
    return this.fabric(`${this.endpoint}${path}${params && `?${this.objectToQuery(params)}`}`, null, headers);
  }
}

export const api: Api = new Api();