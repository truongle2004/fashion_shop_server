import type { IRefreshTokenUseCase } from '@/api/auth/application/use-case/refreshToken.use-case.interface'
import type { Request, Response } from 'express'
import { RefreshTokenNotFoundException } from '@/api/auth/application/exceptions/RefreshToken.exception'
import { HttpStatus, Inject, type LoggerService } from '@nestjs/common'
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { RefreshTokenExpiredException } from '@/api/auth/application/exceptions/RefreshTokenExpired.exception'

export class RefreshTokenUseCase implements IRefreshTokenUseCase {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,

    private readonly jwtService: JwtService,

    private readonly configService: ConfigService
  ) {}

  async generateTokens(
    payload: any
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('ACCESS_TOKEN_SECRET_SIGNATURE'),
      expiresIn: this.configService.get<string>('ACCESS_TOKEN_EXPIRATION')
    })

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('REFRESH_TOKEN_SECRET_SIGNATURE'),
      expiresIn: this.configService.get<string>('REFRESH_TOKEN_EXPIRATION')
    })

    return { accessToken, refreshToken }
  }

  async execute(req: Request, res: Response): Promise<void> {
    try {
      const refreshTokenFromCookie = req.cookies?.refreshToken || null

      if (!refreshTokenFromCookie) {
        throw new RefreshTokenNotFoundException()
      }

      const payload = await this.jwtService.verifyAsync(
        refreshTokenFromCookie,
        {
          secret: this.configService.get<string>(
            'REFRESH_TOKEN_SECRET_SIGNATURE'
          )
        }
      )

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { exp, iat, ...userInfo } = payload

      const { accessToken, refreshToken } = await this.generateTokens(userInfo)

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        sameSite: 'none',
        secure: true
      })

      res.status(HttpStatus.OK).json({ accessToken })
    } catch (error) {
      this.logger.error(error.stack)
      if (error?.message.includes('expired')) {
        throw new RefreshTokenExpiredException()
      }
    }
  }
}
