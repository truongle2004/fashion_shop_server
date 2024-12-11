import { User } from '@/api/auth/domain/entities/user.entity'

export interface IUserRepository {
  /**
   * Get user information by id
   * @param userId - user id
   * @return User
   * */
  getUserInfo(userId: string): Promise<User>
}
