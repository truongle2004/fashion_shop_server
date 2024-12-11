import { Body, Controller, Inject, Post, Res } from '@nestjs/common'
import { CREATE_PRODUCT_USECASE } from '@/api/products/product.di-token'
import { ICreateProductUseCase } from '@/api/products/application/use-cases/create.use-case.interface'
import { CreateProductDto } from '@/api/products/application/dtos/createProduct.dto'
import { Response } from 'express'

@Controller('api/products')
export class ProductHttpController {
  constructor(
    @Inject(CREATE_PRODUCT_USECASE)
    private readonly createProductUseCase: ICreateProductUseCase
  ) {}

  @Post()
  async create(@Body() createDto: CreateProductDto, @Res() res: Response) {
    return this.createProductUseCase.execute(createDto, res)
  }
}
