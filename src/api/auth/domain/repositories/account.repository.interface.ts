import { Account } from '@/api/auth/domain/entities/account.entity'

export interface IAccountRepository {
  findAccountByEmail(email: string): Promise<Account>
  findAccountById(id: string): Promise<Account>
  createAccount(account: Account): Promise<void>
  updateAccount(account: Partial<Account>, id: string): Promise<boolean>
}
