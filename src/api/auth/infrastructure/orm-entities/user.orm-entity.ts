import { Entity, Column, ManyToOne } from 'typeorm'
import { AccountOrmEntity } from './account.orm-entity'
import { BaseEntity } from '@/shared/base.entity'

@Entity('users')
export class UserOrmEntity extends BaseEntity {
  @Column({
    type: 'varchar'
  })
  username: string

  @ManyToOne(() => AccountOrmEntity, (account) => account.users, {
    onDelete: 'CASCADE'
  })
  account: AccountOrmEntity
}
