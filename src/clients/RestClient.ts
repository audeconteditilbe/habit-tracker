import createOpenApiClient from 'openapi-fetch'

import type { EntriesListQuery } from '@api/types'
import type { paths } from '@api/rest-api'
import { accessTokenService, refreshTokenService } from '@/lib/auth'

const NOT_FOUND_CODE = 404
const UNPROCESSABLE_CODE = 422

export class UnprocessableError extends TypeError { }
export class NotFoundError extends TypeError { }
export class UnhandledError extends TypeError { }

type FetchResponse<T> =
  | { data: Exclude<T, undefined>; error: undefined; response: Response }
  | { data: undefined; error: unknown; response: Response }

const handleResponse = async <T>({
  data,
  response,
}: FetchResponse<T>) => {
  const { ok, status } = response
  if (!ok && status === NOT_FOUND_CODE) {
    return Promise.reject(new NotFoundError())
  }
  if (!ok && status === UNPROCESSABLE_CODE) {
    return Promise.reject(new UnprocessableError())
  }
  if (!ok) {
    return Promise.reject(new UnhandledError())
  }

  return data as Exclude<T, undefined>
}

export class RestClient {
  private static instance: RestClient

  private readonly _client: ReturnType<typeof createOpenApiClient<paths>>

  private constructor(apiPrefix: string = '') {
    const clientUrl = new URL(apiPrefix, import.meta.env.VITE_API_URL).href

    this._client = createOpenApiClient<paths>({
      baseUrl: clientUrl,
      headers: this.authHeaders
    })
  }

  public static getInstance(apiPrefix: string): RestClient {
    if (!RestClient.instance) {
      RestClient.instance = new RestClient(apiPrefix)
    }
    return RestClient.instance
  }

  get authHeaders() {
    const token = accessTokenService.getToken()
    if (token) {
      return {
        'Authorization': `Bearer ${token}`
      }
    }
  }

  async registerUser(username: string, password: string, email?: string) {
    return this._client.POST('/api/user/register/', {
      body: { username, password, email  },
    })
    .then(handleResponse)
    .catch((err: Error) => {
      console.error('Error registering user', err)
      return Promise.reject(err)
    })
  }
  async login(username: string, password: string) {
    return this._client.POST('/api/token/', {
      body: { username, password },
    })
    .then(handleResponse)
    .then(({ access, refresh }) => {
      accessTokenService.setToken(access)
      refreshTokenService.setToken(refresh)
    })
    .catch((err: Error) => {
      console.error('Error logging user in', err)
      return Promise.reject(err)
    })
  }

  async refreshToken(refresh: string) {
    return this._client.POST('/api/token/refresh/', {
      body: { refresh },
      headers: this.authHeaders
    })
    .then(handleResponse)
    .catch((err: Error) => {
      console.error('Error refreshing token', err)
      return Promise.reject(err)
    })
  }

  async getEntries(query: EntriesListQuery, page?: number) {
    return this._client.GET(
      "/api/entries",
      {
        params: { query: { ...query, page } },
        headers: this.authHeaders
      }
    )
    .then(handleResponse)
    .catch((err: Error) => {
      console.error('Error fetching entry list', err)
      return Promise.reject(err)
    })
  }

  async getHabits(userId: string, page?: number) {
    return this._client.GET(
      "/api/habits",
      {
        params: { query: { userId, page } },
        headers: this.authHeaders
      },
    )
    .then(handleResponse)
    .catch((err: Error) => {
      console.error('Error fetching habit list', err)
      return Promise.reject(err)
    })
  }

  async getHabit(habitId: number) {
    return this._client.GET(
      '/api/habits/{id}',
      { params: { path: { id: habitId } }, headers: this.authHeaders }
    )
    .then(handleResponse)
    .catch((err: Error) => {
      console.error('Error fetching habit details', err)
      return Promise.reject(err)
    })
  }
  
  async whoAmI() {
    return this._client.GET(
      '/api/whoami/',
      { headers: this.authHeaders }
    )
    .then(handleResponse)
    .catch((err: Error) => {
      console.error('Error fetching user', err)
      return Promise.reject(err)
    })
  }

  // entries_create
  // entries_retrieve
  // entries_destroy
  // entries_partial_update
  // habits_list
  // habits_create
  // habits_retrieve
  // habits_destroy
  // habits_partial_update
  // token_create
  // token_refresh_create
  // user_register_create
  // users_retrieve

}
