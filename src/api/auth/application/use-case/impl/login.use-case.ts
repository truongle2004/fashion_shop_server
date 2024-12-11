import { AccountNotFoundException } from '@/api/auth/application/exceptions/AccountNotFound.exception'
import { InvalidPasswordException } from '@/api/auth/application/exceptions/InValidPassword.exception'
import { ILoginUseCase } from '@/api/auth/application/use-case/login.use-case.interface'
import { IAccountRepository } from '@/api/auth/domain/repositories/account.repository.interface'
import { IEncryptionService } from '@/api/auth/infrastructure/encryption/encryption.interface'
import { HttpStatus, Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import type { Response } from 'express'

@Injectable()
export class LoginUseCase implements ILoginUseCase {
  constructor(
    @Inject('IEncryptionService')
    private readonly encryptionService: IEncryptionService,

    @Inject('IAccountRepository')
    private readonly accountRepository: IAccountRepository,

    private readonly configService: ConfigService,

    private readonly jwtService: JwtService
  ) {}

  // FIXME: duplicate code
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

  async execute(
    email: string,
    encryptedPassword: string,
    res: Response
  ): Promise<any> {
    const account = await this.accountRepository.findAccountByEmail(email)
    if (!account) {
      throw new AccountNotFoundException(email)
    }

    const decryptedPassword = this.encryptionService.decrypt(encryptedPassword)

    const isValidPassword = bcrypt.compareSync(
      decryptedPassword,
      account.password
    )

    if (!isValidPassword) {
      throw new InvalidPasswordException()
    }

    const payload = {
      username: account.username,
      id: account.id,
      email: account.email
    }

    const { accessToken, refreshToken } = await this.generateTokens(payload)

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: this.configService.get<boolean>('IS_PRODUCTION'),
      sameSite: 'strict'
    })

    res.status(HttpStatus.OK).json({
      message: `welcome ${account.username}`,
      id: account.id,
      accessToken
    })
  }
}
