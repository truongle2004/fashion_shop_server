import type { Response } from 'express'

export interface IGetDetailInfoUseCase {
  /**
   * Fetches detailed information for a product by its ID.
   *
   * @param id - The unique identifier of the product.
   * @param res - The Express response object data
   * */
  execute(id: string, res: Response): Promise<void>
}
