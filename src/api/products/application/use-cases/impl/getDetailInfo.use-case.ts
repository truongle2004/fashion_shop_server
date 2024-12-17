import { Response } from 'express'
import { IGetDetailInfoUseCase } from '@/api/products/application/use-cases/getDetailInfo.use-case.interface'
import { PRODUCT_REPOSITORY } from '@/api/products/product.di-token'
import { HttpStatus, Inject, LoggerService } from '@nestjs/common'
import { IProductRepository } from '@/api/products/application/repositories/product.repository.interface'
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston'
import { ProductNotFoundException } from '@/api/products/application/exceptions/ProductNotFound.exception'

export class GetDetailInfoUseCase implements IGetDetailInfoUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,

    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService
  ) {}
  async execute(id: string, res: Response): Promise<void> {
    try {
      const info = await this.productRepository.getProductInfoById(id)

      console.log(info)

      if (!info) {
        throw new ProductNotFoundException()
      }

      res.status(HttpStatus.OK).json(info)
    } catch (error) {
      this.logger.error(error.stack)
    }
  }
}
