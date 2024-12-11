import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import type { TypeOrmModuleOptions } from '@nestjs/typeorm'
import type { DataBaseConfig } from '../database.config'

@Injectable()
export class MysqlConfig implements DataBaseConfig<TypeOrmModuleOptions> {
  constructor(private configService: ConfigService) {}

  getConfig(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: this.configService.get<string>('MYSQL_HOST', 'localhost'),
      port: this.configService.get<number>('MYSQL_PORT', 3306),
      username: this.configService.get<string>('MYSQL_USER', 'root'),
      password: this.configService.get<string>('MYSQL_PASSWORD', 'password'),
      database: this.configService.get<string>('MYSQL_DATABASE', 'test'),
      entities: ['dist/**/*.orm-entity.js'],
      synchronize: this.configService.get<boolean>('MYSQL_SYNCHRONIZE', false),
      logging: true
    }
  }
}
