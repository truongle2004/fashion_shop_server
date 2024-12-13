import { CreateProductUseCase } from '@/api/products/application/use-cases/impl/create.use-case'
import { ProductOrmEntity } from '@/api/products/infrastructure/orm-entities/product.orm-entity'
import { ProductImageOrmEntity } from '@/api/products/infrastructure/orm-entities/productImage.orm-entity'
import { ProductRepository } from '@/api/products/infrastructure/repositories/product.repository'
import { ProductHttpController } from '@/api/products/presentation/product.controller'
import { Module, Provider } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

const dependencies: Provider[] = [
  {
    provide: 'IProductRepository',
    useClass: ProductRepository
  },
  {
    provide: 'ICreateProductUseCase',
    useClass: CreateProductUseCase
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
