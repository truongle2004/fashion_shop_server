import type { IGetAccountUseCase } from '@/api/auth/application/use-case/getAccount.use-case.interface'
import type { IAccountRepository } from '@/api/auth/domain/repositories/account.repository.interface'
import { HttpStatus, Inject, type Logger } from '@nestjs/common'
import { AccountNotFoundException } from '@/api/auth/application/exceptions/AccountNotFound.exception'
import type { Response } from 'express'
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston'

export class GetAccountUseCase implements IGetAccountUseCase {
  constructor(
    @Inject('IAccountRepository')
    private readonly accountRepository: IAccountRepository,

    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: Logger
  ) {}

  async execute(accountId: string, res: Response): Promise<any> {
    try {
      const account = await this.accountRepository.findAccountById(accountId)

      if (!account) {
        throw new AccountNotFoundException(accountId)
      }

      const { id, username, email } = account

      res.status(HttpStatus.OK).json({
        id,
        username,
        email
      })
    } catch (error) {
      this.logger.error(error.stack)
    }
  }
}
