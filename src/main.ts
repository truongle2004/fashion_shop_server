import { NestFactory } from '@nestjs/core'
import * as cookieParser from 'cookie-parser'
import { AppModule } from '@/app.module'
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface'
import { ConfigService } from '@nestjs/config'
import { IS_DEV } from '@/utils/config'
import { ValidationPipe, VersioningType } from '@nestjs/common'
import { GlobalExceptionFilter } from '@/filers/GlobalExceptionFilter'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: IS_DEV ? ['log', 'debug', 'error', 'warn'] : ['error', 'warn']
  })

  const configService = app.get(ConfigService)

  app.enableVersioning({
    type: VersioningType.URI
  })

  app.useGlobalFilters(new GlobalExceptionFilter())

  app.useGlobalPipes(new ValidationPipe())

  const corsOptions: CorsOptions = {
    origin: [configService.get<string>('CORS_ORIGIN')],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true
  }

  app.enableCors(corsOptions)

  app.use(cookieParser())

  await app.listen(3000)
}
bootstrap()
