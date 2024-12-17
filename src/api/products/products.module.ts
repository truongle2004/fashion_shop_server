import { CreateProductUseCase } from '@/api/products/application/use-cases/impl/create.use-case'
import { ProductOrmEntity } from '@/api/products/infrastructure/orm-entities/product.orm-entity'
import { ProductImageOrmEntity } from '@/api/products/infrastructure/orm-entities/productImage.orm-entity'
import { ProductRepository } from '@/api/products/infrastructure/repositories/product.repository'
import { ProductHttpController } from '@/api/products/presentation/product.controller'
import { Module, Provider } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { GetRandomProductUseCase } from './application/use-cases/impl/getRandom.use-case'
import {
  CREATE_PRODUCT_USECASE,
  GET_BY_CATEGORY_USECASE,
  GET_RANDOM_PRODUCT_USECASE,
  ORDER_PRODUCT_BY_PRICE_USECASE,
  PRODUCT_REPOSITORY
} from './product.di-token'
import { GetProductListByCategoryUseCase } from './application/use-cases/impl/getByCategory.use-case'
import { OrderProductByPriceUseCase } from './application/use-cases/impl/orderByPrice.use-case'

const dependencies: Provider[] = [
  {
    provide: PRODUCT_REPOSITORY,
    useClass: ProductRepository
  },
  {
    provide: CREATE_PRODUCT_USECASE,
    useClass: CreateProductUseCase
  },
  {
    provide: GET_RANDOM_PRODUCT_USECASE,
    useClass: GetRandomProductUseCase
  },
  {
    provide: GET_BY_CATEGORY_USECASE,
    useClass: GetProductListByCategoryUseCase
  },
  {
    provide: ORDER_PRODUCT_BY_PRICE_USECASE,
    useClass: OrderProductByPriceUseCase
  }
]

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductOrmEntity, ProductImageOrmEntity])
  ],
  controllers: [ProductHttpController],
  providers: [...dependencies],
  exports: ['IProductRepository']
})
export class ProductsModule {}
