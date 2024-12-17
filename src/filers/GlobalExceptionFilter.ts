import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus
} from '@nestjs/common'
import { AccountNotFoundException } from '@/api/auth/application/exceptions/AccountNotFound.exception'
import { InvalidPasswordException } from '@/api/auth/application/exceptions/InValidPassword.exception'
import { AccountExistException } from '@/api/auth/application/exceptions/AccountExist.exception'
import { RefreshTokenNotFoundException } from '@/api/auth/application/exceptions/RefreshToken.exception'
import { RefreshTokenExpiredException } from '@/api/auth/application/exceptions/RefreshTokenExpired.exception'
import { AccessTokenExpiredException } from '@/api/auth/application/exceptions/AccessTokenExpired.exception'
import { InvalidOrderTypeException } from '@/api/products/application/exceptions/InvalidOrderType.exception'
import { ProductNotFoundException } from '@/api/products/application/exceptions/ProductNotFound.exception'

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()

    if (exception instanceof AccountNotFoundException) {
      return response
        .status(HttpStatus.NOT_FOUND)
        .json({ message: exception.message })
    }

    if (exception instanceof InvalidPasswordException) {
      return response
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: exception.message })
    }

    if (exception instanceof AccountExistException) {
      return response
        .status(HttpStatus.CONFLICT)
        .json({ message: exception.message })
    }

    if (exception instanceof RefreshTokenNotFoundException) {
      return response
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: exception.message })
    }

    if (exception instanceof RefreshTokenExpiredException) {
      return response
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: exception.message })
    }

    if (exception instanceof AccessTokenExpiredException) {
      return response.status(HttpStatus.GONE).send()
    }

    if (exception instanceof InvalidOrderTypeException) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: exception.message
      })
    }

    if (exception instanceof ProductNotFoundException) {
      return response.status(HttpStatus.NOT_FOUND).json({
        message: exception.message
      })
    }

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Internal Server Error'
    })
  }
}
