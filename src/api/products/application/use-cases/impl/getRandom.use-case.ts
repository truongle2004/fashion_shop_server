import { IProductRepository } from '@/api/products/application/repositories/product.repository.interface'
import { IGetRandomProductsUseCase } from '@/api/products/application/use-cases/getRandom.use-case.interface'
import { PRODUCT_REPOSITORY } from '@/api/products/product.di-token'
import { HttpStatus, Inject, type LoggerService } from '@nestjs/common'
import { Response } from 'express'
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston'

export class GetRandomProductUseCase implements IGetRandomProductsUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,

    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService
  ) {}
  async execute(res: Response): Promise<void> {
    try {
      const randomProducts = await this.productRepository.getRandomProducts()
      res.status(HttpStatus.OK).json(randomProducts)
    } catch (error) {
      this.logger.error(error.stack)
    }
  }
}
