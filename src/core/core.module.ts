import { Global, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { WinstonModule } from 'nest-winston'
import * as winston from 'winston'

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp(),
            winston.format.json(),
            winston.format.prettyPrint(),
            winston.format.printf(({ timestamp, level, message, context }) => {
              return `[${timestamp}] ${level.toUpperCase()} [${context}]: ${message}`
            })
          )
        })
      ]
    })
  ],
  exports: [ConfigModule, WinstonModule]
})
export class CoreModule {}
