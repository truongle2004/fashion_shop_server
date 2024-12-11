import { InjectRepository } from '@nestjs/typeorm'
import { UserOrmEntity } from '@/api/auth/infrastructure/orm-entities/user.orm-entity'
import { Repository } from 'typeorm'
import { IUserRepository } from '@/api/auth/domain/repositories/user.repository.interface'
import { User } from '@/api/auth/domain/entities/user.entity'

export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly userRepository: Repository<UserOrmEntity>
  ) {}

  async getUserInfo(userId: string): Promise<User> {
    const userOrmEntity = await this.userRepository.findOne({
      where: {
        id: userId
      }
    })
    return this.toDomainEntity(userOrmEntity)
  }

  public toDomainEntity(userOrmEntity: UserOrmEntity): User {
    const { id, username } = userOrmEntity
    return new User(id, username)
  }
}
