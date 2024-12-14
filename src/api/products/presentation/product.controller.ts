import { Body, Controller, Get, Inject, Post, Res } from '@nestjs/common'
import {
  CREATE_PRODUCT_USECASE,
  GET_RANDOM_PRODUCT_USECASE
} from '@/api/products/product.di-token'
import { ICreateProductUseCase } from '@/api/products/application/use-cases/create.use-case.interface'
import { CreateProductDto } from '@/api/products/application/dtos/createProduct.dto'
import { Response } from 'express'
import { IGetRandomProductsUseCase } from '../application/use-cases/getRandom.use-case.interface'

@Controller('api/products')
export class ProductHttpController {
  constructor(
    @Inject(CREATE_PRODUCT_USECASE)
    private readonly createProductUseCase: ICreateProductUseCase,

    @Inject(GET_RANDOM_PRODUCT_USECASE)
    private readonly getRandomProductUseCase: IGetRandomProductsUseCase
  ) {}

  @Post()
  async create(@Body() createDto: CreateProductDto, @Res() res: Response) {
    return await this.createProductUseCase.execute(createDto, res)
  }

  @Get()
  async getRandom(@Res() res: Response) {
    return await this.getRandomProductUseCase.execute(res)
  }
}
