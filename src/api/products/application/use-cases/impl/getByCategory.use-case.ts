import { IProductRepository } from '@/api/products/application/repositories/product.repository.interface'
import { IGetProductListByCategoryUseCase } from '@/api/products/application/use-cases/getByCategory.use-case.interface'
import { PRODUCT_REPOSITORY } from '@/api/products/product.di-token'
import { HttpStatus, Inject, Injectable, LoggerService } from '@nestjs/common'
import { Response } from 'express'
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston'
import { PaginateQuery } from 'nestjs-paginate'

// TODO: create paginate if there are too much products
@Injectable()
export class GetProductListByCategoryUseCase
  implements IGetProductListByCategoryUseCase
{
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,

    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService
  ) {}

  async executeV1(
    query: PaginateQuery,
    category: string,
    res: Response
  ): Promise<void> {
    try {
      const data = await this.productRepository.getProductListByCategoryV1(
        query,
        category
      )

      const { products, totalPages } = data

      res.status(HttpStatus.OK).json({
        products,
        totalPages
      })
    } catch (error) {
      this.logger.error(error.stack)
    }
  }

  async execute(category: string, res: Response): Promise<void> {
    try {
      const productByCategory =
        await this.productRepository.getProductListByCategory(category)

      res.status(HttpStatus.OK).json(productByCategory)
    } catch (error) {
      this.logger.error(error.stack)
    }
  }
}
