import type { Request, Response } from 'express'

export interface IRefreshTokenUseCase {
  execute(req: Request, res: Response): Promise<void>
}
