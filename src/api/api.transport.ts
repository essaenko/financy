import {AUTH_TOKEN_LOCAL_STORAGE_KEY} from "../globals.config";

class Api {
  private endpoint: string = 'http://localhost/api/v1';
  private token: string | null = localStorage.getItem(AUTH_TOKEN_LOCAL_STORAGE_KEY);
  private get defaultHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    }
};

  private fabric = (url: string, body?: BodyInit | null, headers?: HeadersInit, params?: Pick<RequestInit, any>) => {
    return fetch(url, {
      ...params,
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

  async get(path: string, params?: Record<string, string | number | boolean | null>, headers?: Record<string, string>): Promise<Response> {
    return this.fabric(`${this.endpoint}${path}${params ? `?${this.objectToQuery(params)}` : ''}`, null, headers);
  }

  async post(path: string, body?: Record<string, string | number | boolean | null>, headers?: Record<string, string>) {
    return this.fabric(`${this.endpoint}${path}`, JSON.stringify(body), headers, { method: "POST" });
  }

  async useToken(token: string) {
    this.token = token;
  }
}

export const api: Api = new Api();