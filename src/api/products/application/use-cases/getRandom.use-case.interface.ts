import { Response } from 'express'

export interface IGetRandomProductsUseCase {
  execute(res: Response): Promise<void>
}
