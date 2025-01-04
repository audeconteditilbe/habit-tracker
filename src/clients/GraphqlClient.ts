import { ApolloClient, HttpLink, InMemoryCache, gql, type NormalizedCacheObject } from "@apollo/client/core"
import { UnhandledError } from "./RestClient"
import type { SummaryHabit } from "@api/types"
import { accessTokenService } from "@/lib/auth"

export const buildSummaryQuery = (author: string, span?: number) => span
  ? gql`{
    habits(author: ${author}) {
      id
      name
      private
      goal
      goalTimespan
      goalType
      goalFrom
      goalTo
      entries (span: ${span}) {
        id
        date
        description
      }
    }
  }
  `
  : gql`{
    habits(author: ${author}) {
      id
      name
      private
      goal
      goalTimespan
      goalType
      goalFrom
      goalTo
      entries {
        id
        date
        description
      }
    }
  }
  `

export class GqlClient {
  private static instance: GqlClient

  private readonly _client: ApolloClient<NormalizedCacheObject>

  private constructor(apiPrefix: string) {
    const clientUrl = new URL(apiPrefix, import.meta.env.VITE_API_URL).href

    const httpLink = new HttpLink({
      uri: clientUrl,
      fetch: (uri, options) => {
        const token = accessTokenService.getToken()
          if (token) {
            options = {
              ...options,
              headers: {
                ...options?.headers,
                Authorization: `Bearer ${token}`,
              }
            }
          }
          return fetch(uri, options)
      },
    })
    this._client = new ApolloClient({ link: httpLink, cache: new InMemoryCache() })
  }

  public static getInstance(apiPrefix: string): GqlClient {
    if (!GqlClient.instance) {
      GqlClient.instance = new GqlClient(apiPrefix)
    }
    return GqlClient.instance
  }

  async getUserHabitSummary (author: string, span?: number): Promise<SummaryHabit[]> {
    const query = buildSummaryQuery(`${author}`, span)
    return this._client.query({ query })
      .then(({ data, errors }) => {
        if (errors && errors.length > 0) {
          return Promise.reject(new UnhandledError(JSON.stringify(errors)))
        }
        return (data as { habits: SummaryHabit[] }).habits
      })
      .catch((err) => {
        console.error('Error fetching user summary', err)
        return Promise.reject(new UnhandledError(err))
      })
  }
}
