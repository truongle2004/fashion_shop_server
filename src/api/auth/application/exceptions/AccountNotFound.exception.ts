export class AccountNotFoundException extends Error {
  constructor(email: string) {
    super(`Account with ${email} was not found`)
    this.name = 'AccountNotFoundException'
  }
}
