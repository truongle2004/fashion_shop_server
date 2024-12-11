import type { CreateProductDto } from '@/api/products/application/dtos/createProduct.dto'
import type { Response } from 'express'

export interface ICreateProductUseCase {
  execute(createDto: CreateProductDto, res: Response): Promise<void>
}
