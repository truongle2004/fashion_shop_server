export class AccessTokenExpiredException extends Error {
  constructor() {
    super()
    this.name = 'AccessTokenExpiredException'
  }
}
