import type { CreateProductDto } from '@/api/products/application/dtos/createProduct.dto'
import type { IProductRepository } from '@/api/products/application/repositories/product.repository.interface'
import type { ICreateProductUseCase } from '@/api/products/application/use-cases/create.use-case.interface'
import { ImageColor } from '@/api/products/entities/models/imageColor.entity'
import { Product } from '@/api/products/entities/models/product.entity'
import { PRODUCT_REPOSITORY } from '@/api/products/product.di-token'
import { HttpStatus, Inject, Injectable } from '@nestjs/common'
import { Response } from 'express'

@Injectable()
export class CreateProductUseCase implements ICreateProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository
  ) {}

  async execute(createDto: CreateProductDto, res: Response): Promise<void> {
    const {
      name,
      price,
      sizes,
      category,
      currency,
      descriptionOfUse,
      features,
      imagesColor
    } = createDto

    const productEntity = new Product({
      name,
      price,
      sizes,
      category,
      currency,
      descriptionOfUse,
      features,
      imagesColor: imagesColor.map((item) => {
        return new ImageColor({
          url: item.url,
          color: item.color
        })
      })
    })

    // TODO: check product name before saving

    const createdProduct = await this.productRepository.create(productEntity)

    res.status(HttpStatus.CREATED).json({
      message: 'Product created successfully',
      data: createdProduct
    })
  }
}
