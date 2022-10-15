import { AUTH_TOKEN_LOCAL_STORAGE_KEY } from '../globals.config';

class Api {
  private endpoint: string =
    process.env.NODE_ENV === 'production'
      ? `/api/v1`
      : `${window.location.protocol}//${window.location.hostname}:8080/api/v1`;
  private token: string | null = localStorage.getItem(
    AUTH_TOKEN_LOCAL_STORAGE_KEY,
  );
  private get defaultHeaders(): Record<string, string> {
    return {
      Authorization: `Bearer ${this.token}`,
    };
  }

  private fabric = (
    url: string,
    body?: BodyInit | null,
    headers?: HeadersInit,
    params?: Pick<RequestInit, keyof RequestInit>,
  ) => {
    return fetch(url, {
      ...params,
      body,
      headers: {
        ...this.defaultHeaders,
        ...headers,
      },
    });
  };

  private objectToQuery = (
    params: Record<string, string | number | boolean | null>,
  ): string => {
    const query = new URLSearchParams();
    const keys: string[] = Object.keys(params);

    keys.forEach(key => {
      query.append(key, params[key]?.toString() ?? '');
    });

    return query.toString();
  };

  async upload(
    path: string,
    body: FormData,
    headers?: Record<string, string>,
  ): Promise<Response> {
    return this.fabric(`${this.endpoint}${path}`, body, headers, {
      method: 'POST',
    });
  }

  async get(
    path: string,
    params?: Record<string, string | number | boolean | null>,
    headers?: Record<string, string>,
  ): Promise<Response> {
    return this.fabric(
      `${this.endpoint}${path}${
        params ? `?${this.objectToQuery(params)}` : ''
      }`,
      null,
      headers,
    );
  }

  async post(
    path: string,
    body?: Record<string, string | number | boolean | null> | FormData,
    headers?: Record<string, string>,
  ) {
    return this.fabric(
      `${this.endpoint}${path}`,
      JSON.stringify(body),
      {
        'Content-Type': 'application/json',
        ...headers,
      },
      { method: 'POST' },
    );
  }

  async useToken(token: string) {
    this.token = token;
  }

  removeToken() {
    localStorage.removeItem(AUTH_TOKEN_LOCAL_STORAGE_KEY);
    if (this.token !== null) {
      this.token = null;
      window.location.reload();
    }
  }
}

export const api: Api = new Api();
