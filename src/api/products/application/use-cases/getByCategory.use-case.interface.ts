import type { Response } from 'express'

export interface IGetProductListByCategoryUseCasen {
  execute(category: string, res: Response): Promise<void>
}
