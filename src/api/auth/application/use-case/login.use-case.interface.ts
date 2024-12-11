import type { Response } from 'express'

export interface ILoginUseCase {
  /**
   * @param email - user email
   * @param encryptedPassword - user password
   */
  execute(
    email: string,
    encryptedPassword: string,
    res: Response
  ): Promise<void>
}
