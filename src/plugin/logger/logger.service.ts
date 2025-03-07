import * as path from 'path'
import { Injectable } from '@nestjs/common'
import * as winston from 'winston'
import { ObjectType } from '@/types'
import 'winston-daily-rotate-file'
import { IS_DEV } from '@/utils/config'

const transportsHandler = () => {
  const transportsList: winston.transport[] = [
    // TODO: the server is not working when the code is changed here
    new winston.transports.DailyRotateFile({
      filename: path.join(process.cwd(), 'logs', 'error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      level: 'error'
    }),
    new winston.transports.DailyRotateFile({
      filename: path.join(process.cwd(), 'logs', 'info-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      handleExceptions: true,
      maxSize: '20m',
      maxFiles: '14d',
      level: 'silly'
    })
  ]
  if (IS_DEV) {
    transportsList.push(new winston.transports.Console({}))
  }
  return transportsList
}

@Injectable()
export class LoggerService {
  private logger: winston.Logger
  constructor() {
    this.logger = winston.createLogger({
      level: IS_DEV ? 'silly' : 'info',
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
        winston.format.colorize(),
        winston.format.printf(({ prefix, timestamp, message, level }) => {
          return `[${timestamp}]-【${level}】-${prefix ? `-【${prefix}】` : ''} ${message}`
        })
      ),
      transports: transportsHandler()
    })
  }

  // log level 0
  public error(message: string | ObjectType, prefix = ''): void {
    this.logger.error(this.toString(message), { prefix })
  }

  // log level 1
  public warn(message: string | ObjectType, prefix = ''): void {
    this.logger.warn(this.toString(message), { prefix })
  }

  // log level 2
  public info(message: string | ObjectType, prefix = ''): void {
    this.logger.info(this.toString(message), { prefix })
  }

  // log level 3
  public http(message: string | ObjectType, prefix = ''): void {
    this.logger.http(this.toString(message), { prefix })
  }

  // log level 4
  public verbose(message: string | ObjectType, prefix = ''): void {
    this.logger.verbose(this.toString(message), { prefix })
  }

  // log level 5
  public debug(message: string | ObjectType, prefix = ''): void {
    this.logger.debug(this.toString(message), { prefix })
  }

  // log level 6
  public silly(message: string | ObjectType, prefix = ''): void {
    this.logger.silly(this.toString(message), { prefix })
  }

  private toString(message: string | ObjectType): string {
    if (typeof message !== 'string') {
      return JSON.stringify(message, null, 2)
    } else {
      return message as string
    }
  }
}
