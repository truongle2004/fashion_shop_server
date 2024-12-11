import type { IRegisterUseCase } from '@/api/auth/application/use-case/register.use-case.interface'
import type { IAccountRepository } from '@/api/auth/domain/repositories/account.repository.interface'
import { HttpStatus, Inject } from '@nestjs/common'
import { AccountExistException } from '@/api/auth/application/exceptions/AccountExist.exception'
import type { IEncryptionService } from '@/api/auth/infrastructure/encryption/encryption.interface'
import { AccountBuilder } from '@/api/auth/domain/entities/builder/impl/account.builder'
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston'
import type { Logger } from 'winston'
import type { Response } from 'express'

export class RegisterUseCase implements IRegisterUseCase {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: Logger,

    @Inject('IAccountRepository')
    private readonly accountRepository: IAccountRepository,

    @Inject('IEncryptionService')
    private readonly encryptService: IEncryptionService
  ) {}
  async execute(
    username: string,
    email: string,
    encryptedPassword: string,
    res: Response
  ): Promise<void> {
    try {
      const account = await this.accountRepository.findAccountByEmail(email)

      if (account) {
        throw new AccountExistException(email)
      }

      const decryptedPassword = this.encryptService.decrypt(encryptedPassword)

      const newAccount = new AccountBuilder()
        .withEmail(email)
        .withUsername(username)
        .withPassword(decryptedPassword)
        .build()

      await this.accountRepository.createAccount(newAccount)

      res.status(HttpStatus.CREATED).json({
        message: 'Account created successfully! Please login to continue'
      })
    } catch (error) {
      this.logger.error(error.stack)
    }
  }
}
