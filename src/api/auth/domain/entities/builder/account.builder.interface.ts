export interface IAccountBuilder {
  withId(id: string): IAccountBuilder
  withEmail(email: string): IAccountBuilder
  withPassword(password: string): IAccountBuilder
  withUsername(username: string): IAccountBuilder
  withRole(role: string): IAccountBuilder
  build(): any
}
