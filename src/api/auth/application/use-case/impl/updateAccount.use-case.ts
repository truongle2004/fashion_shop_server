import { AccountNotFoundException } from '@/api/auth/application/exceptions/AccountNotFound.exception'
import { InvalidPasswordException } from '@/api/auth/application/exceptions/InValidPassword.exception'
import { IUpdateAccountUseCase } from '@/api/auth/application/use-case/updateAccount.use-case.interface'
import { IAccountRepository } from '@/api/auth/domain/repositories/account.repository.interface'
import { IEncryptionService } from '@/api/auth/infrastructure/encryption/encryption.interface'
import { HttpStatus, Inject } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import type { Response } from 'express'
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston'
import { Logger } from 'winston'

export class UpdateAccountUseCase implements IUpdateAccountUseCase {
  constructor(
    @Inject('IAccountRepository')
    private readonly accountRepository: IAccountRepository,

    @Inject('IEncryptionService')
    private readonly encryptionService: IEncryptionService,

    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger
  ) {}

  async execute(
    id: string,
    username: string,
    email: string,
    encryptedPassword: string,
    res: Response
  ): Promise<any> {
    try {
      const account = await this.accountRepository.findAccountById(id)

      if (!account) {
        throw new AccountNotFoundException(email)
      }

      let updatedAccount

      if (encryptedPassword) {
        const newPassword = this.encryptionService.decrypt(encryptedPassword)

        const isValidPassword = bcrypt.compareSync(
          newPassword,
          account.password
        )

        if (!isValidPassword) {
          throw new InvalidPasswordException('Password not match')
        }
        updatedAccount = await this.accountRepository.updateAccount(
          {
            password: encryptedPassword
          },
          id
        )

        if (updatedAccount) {
          return res.status(HttpStatus.OK).send()
        }
      } else if (email) {
        updatedAccount = await this.accountRepository.updateAccount(
          {
            email: email || account.email
          },
          id
        )
        if (updatedAccount) {
          return res.status(HttpStatus.OK).json({
            message: 'Update email success',
            email
          })
        }
      } else if (username) {
        updatedAccount = await this.accountRepository.updateAccount(
          {
            username: username || account.username
          },
          id
        )
        if (updatedAccount) {
          return res.status(HttpStatus.OK).json({
            message: 'Update username success',
            username
          })
        }
      }

      res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Update info failed'
      })
    } catch (error) {
      this.logger.error('Update Account Error')
      this.logger.error(error.stack)
    }
  }
}
