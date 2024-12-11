import { IProductRepository } from '@/api/products/application/repositories/product.repository.interface'
import { Product } from '@/api/products/entities/models/product.entity'
import { ProductOrmEntity } from '@/api/products/infrastructure/orm-entities/product.orm-entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ImageColor } from '@/api/products/entities/models/imageColor.entity'

export class ProductRepository implements IProductRepository {
  constructor(
    @InjectRepository(ProductOrmEntity)
    private readonly productRepository: Repository<ProductOrmEntity>
  ) {}
  async create(product: Product): Promise<Product> {
    const productOrmEntity = this.toOrmEntity(product)
    const result = await this.productRepository.save(productOrmEntity)
    return this.toEntity(result)
  }

  public toOrmEntity(product: Product): ProductOrmEntity {
    const productOrmEntity = new ProductOrmEntity()
    productOrmEntity.name = product.name
    productOrmEntity.price = product.price
    productOrmEntity.category = product.category
    productOrmEntity.currency = product.currency
    productOrmEntity.sizes = product.sizes
    productOrmEntity.description_use = product.descriptionOfUse
    productOrmEntity.features = product.features
    return productOrmEntity
  }

  public toEntity(productOrmEntity: ProductOrmEntity): Product {
    const product = new Product({
      id: productOrmEntity.id,
      name: productOrmEntity.name,
      price: productOrmEntity.price,
      sizes: productOrmEntity.sizes,
      category: productOrmEntity.category,
      currency: productOrmEntity.currency,
      descriptionOfUse: productOrmEntity.description_use,
      features: productOrmEntity.features,
      imagesColor: productOrmEntity.images_color.map((item) => {
        return new ImageColor({
          id: item.id,
          url: item.url,
          color: item.color
        })
      })
    })
    return product
  }
}
