import { CreateProductDto } from '@/api/products/application/dtos/createProduct.dto'
import { ICreateProductUseCase } from '@/api/products/application/use-cases/create.use-case.interface'
import { IGetProductListByCategoryUseCase } from '@/api/products/application/use-cases/getByCategory.use-case.interface'
import { IGetRandomProductsUseCase } from '@/api/products/application/use-cases/getRandom.use-case.interface'
import {
  CREATE_PRODUCT_USECASE,
  GET_BY_CATEGORY_USECASE,
  GET_PRODUCT_DETAIL_INFO_USECASE,
  GET_RANDOM_PRODUCT_USECASE,
  ORDER_PRODUCT_BY_PRICE_USECASE
} from '@/api/products/product.di-token'
import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
  Res,
  Version
} from '@nestjs/common'
import { Response } from 'express'
import { IOrderByPriceUseCase } from '@/api/products/application/use-cases/orderByPrice.use-case.interface'
import { IGetDetailInfoUseCase } from '@/api/products/application/use-cases/getDetailInfo.use-case.interface'
import { Paginate, PaginateQuery } from 'nestjs-paginate'

@Controller('api/products')
export class ProductHttpController {
  constructor(
    @Inject(CREATE_PRODUCT_USECASE)
    private readonly createProductUseCase: ICreateProductUseCase,

    @Inject(GET_RANDOM_PRODUCT_USECASE)
    private readonly getRandomProductUseCase: IGetRandomProductsUseCase,

    @Inject(GET_BY_CATEGORY_USECASE)
    private readonly getByCategoryUseCase: IGetProductListByCategoryUseCase,

    @Inject(ORDER_PRODUCT_BY_PRICE_USECASE)
    private readonly orderProductByPrice: IOrderByPriceUseCase,

    @Inject(GET_PRODUCT_DETAIL_INFO_USECASE)
    private readonly getDetailInfoUseCase: IGetDetailInfoUseCase
  ) {}

  @Post()
  async create(@Body() createDto: CreateProductDto, @Res() res: Response) {
    return await this.createProductUseCase.execute(createDto, res)
  }

  @Get('random')
  async getRandom(@Res() res: Response) {
    return await this.getRandomProductUseCase.execute(res)
  }

  @Get('category/:category')
  async getByCategory(
    @Res() res: Response,
    @Param('category') category: string
  ) {
    return await this.getByCategoryUseCase.execute(category, res)
  }

  @Version('1')
  @Get('category/:category')
  async getByCategoryV1(
    @Paginate() query: PaginateQuery,
    @Param('category') category: string,
    @Res() res: Response
  ) {
    return await this.getByCategoryUseCase.executeV1(query, category, res)
  }

  @Get('sort')
  async orderProductByPriceQuery(
    @Res() res: Response,
    @Query('category') category: string,
    @Query('type') type: 'asc' | 'desc'
  ) {
    return await this.orderProductByPrice.execute(category, type, res)
  }

  @Get('detail/:id')
  async getDetailInfo(@Param('id') id: string, @Res() res: Response) {
    return await this.getDetailInfoUseCase.execute(id, res)
  }
}
