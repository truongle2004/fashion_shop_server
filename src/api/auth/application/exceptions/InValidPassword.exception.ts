export class InvalidPasswordException extends Error {
  constructor(message?: string) {
    super(message || 'The provided password is invalid.')
    this.name = 'InvalidPasswordException'
  }
}
