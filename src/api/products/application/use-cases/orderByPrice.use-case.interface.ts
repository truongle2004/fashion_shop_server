import { Response } from 'express'

export interface IOrderByPriceUseCase {
  /**
   * Executes the use case to fetch and return a list of products ordered by price.
   *
   * This function queries the product data based on the provided category
   * and sorts the results by price in ascending or descending order.
   * The sorted product list is then sent as a response using the Express `Response` object.
   *
   * @param {string} category - The category of the products to filter.
   *                            Example: "signature", "back in stock".
   * @param {string} type - The sorting order type.
   *                        Accepted values: "asc" for ascending or "desc" for descending.
   * @param {Response} res - The Express response object used to send the sorted product list
   *                         back to the client.
   * @returns {Promise<void>} A promise that resolves when the response is sent.
   *
   * @throws {Error} If there is an issue with querying the products or processing the data.
   */
  execute(category: string, type: string, res: Response): Promise<void>
}
