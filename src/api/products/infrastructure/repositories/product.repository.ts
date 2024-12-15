import { IProductRepository } from '@/api/products/application/repositories/product.repository.interface'
import { Product } from '@/api/products/entities/models/product.entity'
import { ProductOrmEntity } from '@/api/products/infrastructure/orm-entities/product.orm-entity'
import { ImageColor } from '@/api/products/entities/models/imageColor.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { ProductImageOrmEntity } from '@/api/products/infrastructure/orm-entities/productImage.orm-entity'

@Injectable()
export class ProductRepository implements IProductRepository {
  constructor(
    @InjectRepository(ProductOrmEntity)
    private readonly productRepository: Repository<ProductOrmEntity>
  ) {}
  async create(product: Product): Promise<Product> {
    const productOrmEntity = this.toProductOrmEntity(product)
    const images = product.imagesColor.map((item) => {
      return this.toProductImageOrmEntity(item)
    })

    productOrmEntity.images_color = images
    const result = await this.productRepository.save(productOrmEntity)
    return this.toProductEntity(result)
  }

  async getRandomProducts(): Promise<Product[]> {
    const productOrmEntity = await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.images_color', 'images_color')
      .select([
        'product.id',
        'product.name',
        'product.price',
        'product.currency',
        'images_color.url',
        'images_color.id'
      ])
      .take(8)
      .getMany()

    const res = productOrmEntity.map((item) =>
      this.toProductEntity({
        ...item,
        images_color: item.images_color.length ? [item.images_color[0]] : []
      })
    )
    return res
  }

  public toProductOrmEntity(product: Product): ProductOrmEntity {
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

  public toProductImageOrmEntity(image: ImageColor): ProductImageOrmEntity {
    const productImageOrmEntity = new ProductImageOrmEntity()
    productImageOrmEntity.url = image.url
    productImageOrmEntity.color = image.color
    return productImageOrmEntity
  }

  public toProductEntity(productOrmEntity: ProductOrmEntity): Product {
    const image_colors = productOrmEntity.images_color.map((item) => {
      return new ImageColor({
        id: item.id,
        url: item.url,
        color: item.color
      })
    })
    const product = new Product({
      id: productOrmEntity.id,
      name: productOrmEntity.name,
      price: productOrmEntity.price,
      sizes: productOrmEntity.sizes,
      category: productOrmEntity.category,
      currency: productOrmEntity.currency,
      descriptionOfUse: productOrmEntity.description_use,
      features: productOrmEntity.features,
      imagesColor: image_colors
    })
    return product
  }
}
