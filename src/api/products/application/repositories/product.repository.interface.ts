import { Product } from '@/api/products/entities/models/product.entity'

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
}
