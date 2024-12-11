import { LoginDto } from '@/api/auth/application/dto/login.dto'
import type { RegisterDto } from '@/api/auth/application/dto/register.dto'
import type { ILoginUseCase } from '@/api/auth/application/use-case/login.use-case.interface'
import type { IRefreshTokenUseCase } from '@/api/auth/application/use-case/refreshToken.use-case.interface'
import type { IRegisterUseCase } from '@/api/auth/application/use-case/register.use-case.interface'
import {
  Body,
  Controller,
  Delete,
  HttpStatus,
  Inject,
  Post,
  Put,
  Req,
  Res
} from '@nestjs/common'
import type { Request, Response } from 'express'

@Controller('api/auth')
export class AuthController {
  constructor(
    @Inject('IRegisterUseCase')
    private readonly registerUseCase: IRegisterUseCase,

    @Inject('ILoginUseCase')
    private readonly loginUseCase: ILoginUseCase,

    @Inject('IRefreshTokenUseCase')
    private readonly refreshTokenUseCase: IRefreshTokenUseCase
  ) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const { password, email } = loginDto
    return await this.loginUseCase.execute(email, password, res)
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto, @Res() res: Response) {
    const { password, email, username } = registerDto
    return await this.registerUseCase.execute(username, email, password, res)
  }

  @Delete('logout')
  async logout(@Res() res: Response) {
    res.clearCookie('refreshToken')
    res.status(HttpStatus.NO_CONTENT).send()
  }

  @Put('refresh')
  async refreshToken(@Req() req: Request, @Res() res: Response) {
    return await this.refreshTokenUseCase.execute(req, res)
  }
}
