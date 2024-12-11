import { Module } from '@nestjs/common'
import { TypeOrmModule, type TypeOrmModuleOptions } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config'
import type { DataBaseConfig } from './config/database.config'
import { MysqlConfig } from './config/impl/mysql.config'

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: false,
      isGlobal: true
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dbConfig: DataBaseConfig<TypeOrmModuleOptions> = new MysqlConfig(
          configService
        )
        return dbConfig.getConfig()
      }
    })
  ],
  providers: [MysqlConfig],
  exports: [TypeOrmModule]
})
export class DatabaseModule {}
