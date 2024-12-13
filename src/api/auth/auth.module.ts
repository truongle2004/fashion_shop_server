import { GetAccountUseCase } from '@/api/auth/application/use-case/impl/getAccount.use-case'
import { LoginUseCase } from '@/api/auth/application/use-case/impl/login.use-case'
import { RegisterUseCase } from '@/api/auth/application/use-case/impl/register.use-case'
import { UpdateAccountUseCase } from '@/api/auth/application/use-case/impl/updateAccount.use-case'
import { EncryptionService } from '@/api/auth/infrastructure/encryption/impl/encrypt.service'
import { KeyService } from '@/api/auth/infrastructure/encryption/impl/key.service'
import { AccountOrmEntity } from '@/api/auth/infrastructure/orm-entities/account.orm-entity'
import { UserOrmEntity } from '@/api/auth/infrastructure/orm-entities/user.orm-entity'
import { AccountRepository } from '@/api/auth/infrastructure/repositories/account.repository'
import { AccountController } from '@/api/auth/presentation/controller/account.controller'
import { AuthController } from '@/api/auth/presentation/controller/auth.controller'
import { KeyController } from '@/api/auth/presentation/controller/key.controller'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RefreshTokenUseCase } from './application/use-case/impl/refreshToken.use-case'

@Module({
  imports: [
    ConfigModule,
    JwtModule.register({}),
    TypeOrmModule.forFeature([AccountOrmEntity, UserOrmEntity])
  ],
  controllers: [AuthController, KeyController, AccountController],
  providers: [
    {
      provide: 'IKeyService',
      useClass: KeyService
    },
    {
      provide: 'IEncryptionService',
      useClass: EncryptionService
    },
    {
      provide: 'IRegisterUseCase',
      useClass: RegisterUseCase
    },
    {
      provide: 'ILoginUseCase',
      useClass: LoginUseCase
    },
    {
      provide: 'IAccountRepository',
      useClass: AccountRepository
    },
    {
      provide: 'IUpdateAccountUseCase',
      useClass: UpdateAccountUseCase
    },
    {
      provide: 'IGetAccountUseCase',
      useClass: GetAccountUseCase
    },
    {
      provide: 'IRefreshTokenUseCase',
      useClass: RefreshTokenUseCase
    }
  ]
})
export class AuthModule {}
