import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  NestInterceptor
} from '@nestjs/common'
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston'
import { Observable } from 'rxjs'
import { map, tap } from 'rxjs/operators'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest()
    const method = request.method
    const url = request.url
    const now = Date.now()
    const body = request.body
    const params = request.params
    const query = request.query
    const user = request.user

    return next.handle().pipe(
      tap(() => {
        this.logger.log(
          `${method} ${url} ${Date.now() - now}ms`,
          context.getClass().name
        )
      }),
      map((data) => {
        const message = {
          timestamp: new Date().toISOString(),
          url,
          method,
          user,
          body,
          params,
          query,
          response: data
        }
        this.logger.log(message, 'HTTP Request Details')
        return data
      })
    )
  }
}
