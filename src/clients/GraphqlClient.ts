import { ApolloClient, InMemoryCache, gql, type NormalizedCacheObject } from "@apollo/client/core"
import { ACCESS_TOKEN, UnhandledError } from "./RestClient"

export const buildSummaryQuery = (author: string, span?: number) => gql`{
  habits(author: ${author}) {
    id
    name
    goalTimespan
    goalType
    goalFrequency
    entries(span: ${span}) {
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
    console.log(clientUrl)
    this._client = new ApolloClient({
      uri: clientUrl,
      cache: new InMemoryCache(),
      headers: this.authHeaders
    })
  }

  get authHeaders() {
      const token = localStorage.getItem(ACCESS_TOKEN)
      if (token) {
        return {
          'Authorization': `Bearer ${token}`
        }
      }
    }

  public static getInstance(apiPrefix: string): GqlClient {
    if (!GqlClient.instance) {
      GqlClient.instance = new GqlClient(apiPrefix)
    }
    return GqlClient.instance
  }

  async getUserHabitSummary (author: string, span?: number) {
    const query = buildSummaryQuery(`${author}`, span)
    console.log(query)
    return this._client.query({
      query,
      // variables: pg !== undefined
      //   ? { limit: 100, offset: pg * 100 }
      //   : undefined
    })
      .then(({data, errors}) => {
        if (errors && errors.length > 0) {
          return Promise.reject(new UnhandledError(JSON.stringify(errors)))
        }
        return data
      })
      .catch((err) => {
        console.error('Error fetching user summary', err)
        return Promise.reject(new UnhandledError(err))
      })
  }

}
