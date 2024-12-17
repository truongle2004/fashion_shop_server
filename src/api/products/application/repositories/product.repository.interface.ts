import { Product } from '@/api/products/entities/models/product.entity'
import { OrderType } from '@/types'

export interface IProductRepository {
  /**
   * @param product Product entity
   * */
  create(product: Product): Promise<Product>

  // TODO: increase to 10 products
  /**
   * Get random 8 products
   * @return Product[]
   * */
  getRandomProducts(): Promise<Product[]>

  /**
   * @param category Product category
   * @return Product[]
   * */
  getProductListByCategory(category: string): Promise<Product[]>

  /**
   *@param category Product category
   * @param enum type 'asc' or 'desc'
   * @return Product[]
   * */
  orderProductByPrice(category: string, type: OrderType): Promise<Product[]>
}
