import { Account } from '@/api/auth/domain/entities/account.entity'
import { IAccountBuilder } from '@/api/auth/domain/entities/builder/account.builder.interface'

export class AccountBuilder implements IAccountBuilder {
  private id: string
  private email: string
  private password: string
  private username: string
  private role: string

  withId(id: string): IAccountBuilder {
    this.id = id
    return this
  }

  withEmail(email: string): IAccountBuilder {
    this.email = email
    return this
  }

  withPassword(password: string): IAccountBuilder {
    this.password = password
    return this
  }

  withUsername(username: string): IAccountBuilder {
    this.username = username
    return this
  }

  withRole(role: string): IAccountBuilder {
    this.role = role
    return this
  }

  build(): Account {
    return new Account(
      this.id,
      this.username,
      this.email,
      this.password,
      this.role
    )
  }
}
