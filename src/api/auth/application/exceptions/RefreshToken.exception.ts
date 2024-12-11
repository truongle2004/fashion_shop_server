export class RefreshTokenNotFoundException extends Error {
  constructor() {
    super('you need to login again')
    this.name = 'RefreshTokenExpiredException'
  }
}
