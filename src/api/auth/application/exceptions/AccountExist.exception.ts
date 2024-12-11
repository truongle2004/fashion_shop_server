export class AccountExistException extends Error {
  constructor(email: string) {
    super(`Account with email ${email} already exist`)
    this.name = 'AccountExistException'
  }
}
