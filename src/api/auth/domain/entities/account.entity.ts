export class Account {
  private readonly _id: string
  private readonly _username: string
  private readonly _email: string
  private readonly _password: string
  private readonly _role: string

  constructor(
    id: string,
    username: string,
    email: string,
    password: string,
    role: string
  ) {
    this._id = id
    this._username = username
    this._email = email
    this._password = password
    this._role = role
  }

  get username(): string {
    return this._username
  }

  get email(): string {
    return this._email
  }

  get password(): string {
    return this._password
  }

  get role(): string {
    return this._role
  }

  get id(): string {
    return this._id
  }
}
