import { Product } from '@/api/products/entities/models/product.entity'
import { OrderType } from '@/types'

/**
 * Interface for interacting with product data storage.
 */
export interface IProductRepository {
  /**
   * Creates a new product in the repository.
   *
   * @param product - The product entity to be created.
   * @returns A promise that resolves with the created product entity.
   */
  create(product: Product): Promise<Product>

  /**
   * Fetches a list of random products.
   *
   * @note Consider increasing the count to 10 products in future implementations.
   * @returns A promise that resolves with an array of up to 8 random products.
   */
  getRandomProducts(): Promise<Product[]>

  /**
   * Retrieves a list of products filtered by category.
   *
   * @param category - The category of products to retrieve.
   * @returns A promise that resolves with an array of products in the specified category.
   */
  getProductListByCategory(category: string): Promise<Product[]>

  /**
   * Retrieves a list of products in a specific category, sorted by price.
   *
   * @param category - The category of products to sort.
   * @param type - The order type for sorting, either 'asc' (ascending) or 'desc' (descending).
   * @returns A promise that resolves with an array of products sorted by price.
   */
  orderProductByPrice(category: string, type: OrderType): Promise<Product[]>

  /**
   * Fetches detailed information for a product by its ID.
   *
   * @param id - The unique identifier of the product.
   * @returns A promise that resolves with the product entity.
   */
  getProductInfoById(id: string): Promise<Product>
}
