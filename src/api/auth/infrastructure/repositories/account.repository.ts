import { Account } from '@/api/auth/domain/entities/account.entity'
import { IAccountRepository } from '@/api/auth/domain/repositories/account.repository.interface'
import { AccountOrmEntity } from '@/api/auth/infrastructure/orm-entities/account.orm-entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

export class AccountRepository implements IAccountRepository {
  constructor(
    @InjectRepository(AccountOrmEntity)
    private readonly accountRepository: Repository<AccountOrmEntity>
  ) {}

  async findAccountById(id: string): Promise<Account> {
    const accountOrmEntity = await this.accountRepository.findOne({
      where: {
        id
      }
    })
    return accountOrmEntity ? this.toDomainEntity(accountOrmEntity) : null
  }

  async createAccount(account: Account): Promise<void> {
    const accountOrmEntity = this.toOrmEntity(account)
    await this.accountRepository.save(accountOrmEntity)
  }

  async findAccountByEmail(email: string): Promise<Account> {
    const accountOrmEntity = await this.accountRepository.findOne({
      where: { email }
    })
    return accountOrmEntity ? this.toDomainEntity(accountOrmEntity) : null
  }

  async updateAccount(account: Partial<Account>, id: string): Promise<boolean> {
    let updated

    const { username, email, password } = account

    if (password) {
      updated = await this.accountRepository.update(
        { id },
        {
          password
        }
      )
    } else if (email) {
      updated = await this.accountRepository.update(
        { id },
        {
          email
        }
      )
    } else if (username) {
      updated = await this.accountRepository.update({ id }, { username })
    }

    return (updated.affected ?? 0) > 0
  }

  public toOrmEntity(account: Partial<Account>): AccountOrmEntity {
    const accountOrmEntity = new AccountOrmEntity()
    accountOrmEntity.username = account.username
    accountOrmEntity.email = account.email
    accountOrmEntity.password = account.password
    return accountOrmEntity
  }

  public toDomainEntity(accountOrmEntity: AccountOrmEntity): Account {
    const account = new Account(
      accountOrmEntity.id,
      accountOrmEntity.username,
      accountOrmEntity.email,
      accountOrmEntity.password,
      accountOrmEntity.role
    )
    return account
  }
}
