import type { ImageColor } from '@/api/products/entities/models/imageColor.entity'

export class Product {
  private readonly _id: string
  private readonly _name: string
  private readonly _price: number
  private readonly _sizes: string[]
  private readonly _category: string
  private readonly _currency: string
  private readonly _descriptionOfUse: string[]
  private readonly _features: string[]
  private readonly _imagesColor: ImageColor[]

  constructor({
    id,
    name,
    price,
    sizes,
    category,
    currency,
    descriptionOfUse,
    features,
    imagesColor
  }: {
    id?: string
    name: string
    price: number
    sizes: string[]
    category: string
    currency: string
    descriptionOfUse: string[]
    features: string[]
    imagesColor: ImageColor[]
  }) {
    this._id = id
    this._name = name
    this._price = price
    this._sizes = sizes
    this._category = category
    this._currency = currency
    this._descriptionOfUse = descriptionOfUse
    this._features = features
    this._imagesColor = imagesColor
  }

  get id(): string {
    return this._id
  }

  get name(): string {
    return this._name
  }

  get price(): number {
    return this._price
  }

  get category(): string {
    return this._category
  }

  get currency(): string {
    return this._currency
  }

  get descriptionOfUse(): string[] {
    return this._descriptionOfUse
  }

  get features(): string[] {
    return this._features
  }

  get imagesColor(): ImageColor[] {
    return this._imagesColor
  }

  get sizes(): string[] {
    return this._sizes
  }
}
