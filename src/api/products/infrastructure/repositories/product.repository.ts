import { IProductRepository } from '@/api/products/application/repositories/product.repository.interface'
import { ImageColor } from '@/api/products/entities/models/imageColor.entity'
import { Product } from '@/api/products/entities/models/product.entity'
import { ProductOrmEntity } from '@/api/products/infrastructure/orm-entities/product.orm-entity'
import { ProductImageOrmEntity } from '@/api/products/infrastructure/orm-entities/productImage.orm-entity'
import { OrderType } from '@/types'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { paginate, PaginateQuery } from 'nestjs-paginate'
import { Repository } from 'typeorm'

@Injectable()
export class ProductRepository implements IProductRepository {
  constructor(
    @InjectRepository(ProductOrmEntity)
    private readonly productRepository: Repository<ProductOrmEntity>
  ) {}

  async getProductInfoById(id: string): Promise<Product> {
    const productOrmEntity = await this.productRepository.findOne({
      where: {
        id
      },
      relations: ['images_color']
    })

    return this.toProductEntity(productOrmEntity)
  }

  async create(product: Product): Promise<Product> {
    const productOrmEntity = this.toProductOrmEntity(product)
    const images = product.imagesColor.map((item) => {
      return this.toProductImageOrmEntity(item)
    })

    productOrmEntity.images_color = images
    const result = await this.productRepository.save(productOrmEntity)
    return this.toProductEntity(result)
  }

  async orderProductByPrice(
    category: string,
    type: OrderType
  ): Promise<Product[]> {
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
      .orderBy('product.price', type)
      .where('product.category = :category', { category })
      .getMany()

    return productOrmEntity.map((product) => this.toProductEntity(product))
  }

  async getProductListByCategory(category: string): Promise<Product[]> {
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
      .where('product.category = :category', { category })
      .getMany()

    return productOrmEntity.map((product) => this.toProductEntity(product))
  }

  async getProductListByCategoryV1(
    query: PaginateQuery,
    category: string
  ): Promise<{ products: Product[]; totalPages: number }> {
    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.images_color', 'images_color')
      .select([
        'product.id',
        'product.name',
        'product.price',
        'product.currency',
        'product.category',
        'images_color.url',
        'images_color.id'
      ])
      .where('product.category = :category', { category })

    // NOTE: nestjs-paginate allow to combine with createQueryBuilder
    const res = await paginate(query, queryBuilder, {
      sortableColumns: ['name']
    })

    /* NOTE: by default data type is Paginated<Product[]> so that we need to map each item
     * to return type Product as the requirement expected
     */
    const productEntity = res?.data.map((item) => this.toProductEntity(item))

    const totalPages = Math.ceil(res.meta.totalPages / res.meta.itemsPerPage)

    return {
      products: productEntity,
      totalPages
    }
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
        'product.category',
        'images_color.url',
        'images_color.id'
      ])
      .orderBy('RAND()')
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
