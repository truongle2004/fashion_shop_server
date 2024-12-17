import { ApiModule } from '@/api/api.module'
import { IProductRepository } from '@/api/products/application/repositories/product.repository.interface'
import { CoreModule } from '@/core/core.module'
import { DatabaseModule } from '@/database/database.module'
import { InterceptorsModule } from '@/interceptors/interceptor.module'
import { Inject, Module, OnModuleInit } from '@nestjs/common'
import { PRODUCT_REPOSITORY } from './api/products/product.di-token'
import { ProductsModule } from './api/products/products.module'
import { products } from './mockdata/products'
import { ImageColor } from './api/products/entities/models/imageColor.entity'
import { Product } from './api/products/entities/models/product.entity'

@Module({
  imports: [
    CoreModule,
    DatabaseModule,
    InterceptorsModule,
    ApiModule,
    ProductsModule
  ]
})
export class AppModule implements OnModuleInit {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly createProductRepo: IProductRepository
  ) {}

  async onModuleInit() {
    // products.map((item) => {
    //   try {
    //     const color_images = item.images_color.map(
    //       (item) => new ImageColor({ url: item.url, color: item.color })
    //     )
    //
    //     const product = new Product({
    //       name: item.name,
    //       price: item.price,
    //       category: item.category,
    //       currency: item.currency,
    //       sizes: item.sizes,
    //       imagesColor: color_images,
    //       descriptionOfUse: item.descriptionOfUse,
    //       features: item.features
    //     })
    //
    //     this.createProductRepo.create(product)
    //   } catch (error) {
    //     console.log(error.stack)
    //   }
    // })
  }
}
