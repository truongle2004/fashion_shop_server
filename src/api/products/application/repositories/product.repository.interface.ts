import { Product } from '@/api/products/entities/models/product.entity'

export interface IProductRepository {
  /**
   * @param product Product entity
   * */
  create(product: Product): Promise<Product>

  /**
   * Get random 5 products
   * @return Product[]
   * */
  getRandomProducts(): Promise<Product[]>
}
