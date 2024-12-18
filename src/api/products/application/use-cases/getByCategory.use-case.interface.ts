import type { Response } from 'express'
import { PaginateQuery } from 'nestjs-paginate'

export interface IGetProductListByCategoryUseCase {
  execute(category: string, res: Response): Promise<void>
  executeV1(query: PaginateQuery, res: Response): Promise<void>
}
