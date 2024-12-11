export class RefreshTokenExpiredException extends Error {
  constructor() {
    super('Your token is expired')
  }
}
