import type { Response } from 'express'

export interface IGetAccountUseCase {
  /**
   * Get account information
   * @param email - user email
   * @returns Promise<any>
   */
  execute(id: string, res: Response): Promise<void>
}
