export const LS_KEY_ACCESS_TOKEN = 'access'
export const LS_KEY_REFRESH_TOKEN = 'refresh'

class TokenService {
  private key: string
  private token: string | null = null

  constructor (key: string) {
    this.key = key
  }

  setToken(token: string) {
      this.token = token
      localStorage.setItem(this.key, token)
  }

  getToken(): string | null {
      if (!this.token) {
          this.token = localStorage.getItem(this.key)
      }
      return this.token
  }

  clearToken() {
      this.token = null
      localStorage.removeItem(this.key)
  }
}

export const accessTokenService = new TokenService(LS_KEY_ACCESS_TOKEN)
export const refreshTokenService = new TokenService(LS_KEY_REFRESH_TOKEN)