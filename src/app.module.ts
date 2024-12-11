import { Inject, Module, OnModuleInit } from '@nestjs/common'
import { CoreModule } from '@/core/core.module'
import { InterceptorsModule } from '@/interceptors/interceptor.module'
import { DatabaseModule } from '@/database/database.module'
import { ApiModule } from '@/api/api.module'
import { CREATE_PRODUCT_USECASE } from '@/api/products/product.di-token'
import { ICreateProductUseCase } from './api/products/application/use-cases/create.use-case.interface'
import { products } from './mockdata/products'
import { CreateProductDto } from './api/products/application/dtos/createProduct.dto'

@Module({
  imports: [CoreModule, DatabaseModule, InterceptorsModule, ApiModule]
})
export class AppModule implements OnModuleInit {
  constructor(
    @Inject(CREATE_PRODUCT_USECASE)
    private readonly createProductUseCase: ICreateProductUseCase
  ) {}

  onModuleInit() {
    products.map((item) => {
      const productDto = new CreateProductDto()
      productDto.name = item.name
      productDto.price = item.price
      productDto.category = item.category
      productDto.currency = item.currency
      productDto.sizes = item.sizes
      productDto.imagesColor = item.images_color
      productDto.descriptionOfUse = item.descriptionOfUse

      this.createProductUseCase.execute(productDto)
    })
  }
}
