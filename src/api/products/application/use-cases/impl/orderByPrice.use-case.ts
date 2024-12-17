import { Response } from 'express'
import { IOrderByPriceUseCase } from '@/api/products/application/use-cases/orderByPrice.use-case.interface'
import { HttpStatus, Inject, LoggerService } from '@nestjs/common'
import { PRODUCT_REPOSITORY } from '@/api/products/product.di-token'
import { IProductRepository } from '@/api/products/application/repositories/product.repository.interface'
import { OrderType } from '@/types'
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston'

export class OrderProductByPriceUseCase implements IOrderByPriceUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService
  ) {}
  async execute(category: string, type: string, res: Response): Promise<void> {
    try {
      const productOrdered = await this.productRepository.orderProductByPrice(
        category,
        type.toUpperCase() as OrderType
      )

      res.status(HttpStatus.OK).json(productOrdered)
    } catch (error) {
      this.logger.error(error.stack)
    }
  }
}
