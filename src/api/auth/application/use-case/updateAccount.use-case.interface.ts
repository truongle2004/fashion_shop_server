import type { Response } from 'express'

export interface IUpdateAccountUseCase {
  /**
   * Update account information
   * @param id - user id
   * @param username - username
   * @param email - user email
   * @param encryptedPassword  - user password
   */
  execute(
    id: string,
    username: string,
    email: string,
    encryptedPassword: string,
    res: Response
  ): Promise<any>
}
