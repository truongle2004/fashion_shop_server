import { Type } from 'class-transformer'
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUrl,
  ValidateNested
} from 'class-validator'

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsNumber()
  price: number

  @IsString()
  @IsNotEmpty()
  category: string

  @IsString()
  @IsNotEmpty()
  currency: string

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  descriptionOfUse: string[]

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  sizes: string[]

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  features: string[]

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImageColor)
  imagesColor: ImageColor[]
}

class ImageColor {
  @IsUrl()
  url: string

  @IsString()
  @IsNotEmpty()
  color: string
}
