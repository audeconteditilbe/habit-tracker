import { normalizeUrl } from "@/lib/url"
import { RestClient } from "./RestClient"
import { GqlClient } from "./GraphqlClient"

const REST_API_PREFIX = ''
const GQL_API_PREFIX = '/api/gql/summary'

// export let ClientSingleton: RestClient | null = null

// const initClients = () => {
//   ClientSingleton = RestClient.getInstance(normalizeUrl(API_PREFIX))
// }

export const RestClientSingleton = RestClient.getInstance(normalizeUrl(REST_API_PREFIX))
export const GqlClientSingleton = GqlClient.getInstance(normalizeUrl(GQL_API_PREFIX))

export default {
  RestClientSingleton,
  GqlClientSingleton,
}
