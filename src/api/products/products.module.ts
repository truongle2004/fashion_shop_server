import { ProductOrmEntity } from '@/api/products/infrastructure/orm-entities/product.orm-entity'
import { ProductImageOrmEntity } from '@/api/products/infrastructure/orm-entities/productImage.orm-entity'
import { Module, Provider } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProductRepository } from '@/api/products/infrastructure/repositories/product.repository'
import {
  CREATE_PRODUCT_USECASE,
  PRODUCT_REPOSITORY
} from '@/api/products/product.di-token'
import { ProductHttpController } from '@/api/products/presentation/product.controller'
import { CreateProductUseCase } from '@/api/products/application/use-cases/impl/create.use-case'

const dependencies: Provider[] = [
  {
    provide: PRODUCT_REPOSITORY,
    useClass: ProductRepository
  },
  {
    provide: CREATE_PRODUCT_USECASE,
    useClass: CreateProductUseCase
  }
]

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductOrmEntity, ProductImageOrmEntity])
  ],
  controllers: [ProductHttpController],
  providers: [...dependencies]
})
export class ProductsModule {}
