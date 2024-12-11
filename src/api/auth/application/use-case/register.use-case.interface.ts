import type { Response } from 'express'

export interface IRegisterUseCase {
  /**
   * @param username - username
   * @param email - user email
   * @param encryptedPassword  - user password
   */
  execute(
    username: string,
    email: string,
    encryptedPassword: string,
    res: Response
  ): Promise<void>
}
