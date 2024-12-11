import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  BeforeInsert,
  BeforeUpdate
} from 'typeorm'
import { UserOrmEntity } from '@/api/auth/infrastructure/orm-entities/user.orm-entity'
import { BaseEntity } from '@/shared/base.entity'
import { Role } from '@/types'
import * as bcrypt from 'bcrypt'

@Entity('accounts')
export class AccountOrmEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ unique: true })
  username!: string

  @Column({ unique: true })
  email: string

  @Column()
  password?: string

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER
  })
  role: Role

  @OneToMany(() => UserOrmEntity, (user) => user.account, { cascade: true })
  users: UserOrmEntity[]

  @BeforeInsert()
  @BeforeUpdate()
  public hashPassword() {
    if (this.password) {
      const salt = bcrypt.genSaltSync(10)
      this.password = bcrypt.hashSync(this.password.trim(), salt)
    }
  }
}
