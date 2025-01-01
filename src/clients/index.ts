import { normalizeUrl } from "@/lib/url"
import { RestClient } from "./RestClient"

const API_PREFIX = ''

// export let ClientSingleton: RestClient | null = null

// const initClients = () => {
//   ClientSingleton = RestClient.getInstance(normalizeUrl(API_PREFIX))
// }

const ClientSingleton = RestClient.getInstance(normalizeUrl(API_PREFIX))

export default ClientSingleton
