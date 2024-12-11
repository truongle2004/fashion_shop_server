import { UpdateDto } from '@/api/auth/application/dto/update.dto'
import type { IGetAccountUseCase } from '@/api/auth/application/use-case/getAccount.use-case.interface'
import { IUpdateAccountUseCase } from '@/api/auth/application/use-case/updateAccount.use-case.interface'
import { AuthGuard } from '@/guard/auth.guard'
import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Res,
  UseGuards
} from '@nestjs/common'
import type { Response } from 'express'

@Controller('account')
export class AccountController {
  constructor(
    @Inject('IUpdateAccountUseCase')
    private readonly updateAccountUseCase: IUpdateAccountUseCase,

    @Inject('IGetAccountUseCase')
    private readonly getAccountUseCase: IGetAccountUseCase
  ) {}

  @Patch(':id/update')
  @UseGuards(AuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateDto,
    @Res() res: Response
  ) {
    const { username, email, password } = updateDto
    return await this.updateAccountUseCase.execute(
      id,
      username,
      email,
      password,
      res
    )
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async getInfo(@Param('id') id: string, @Res() res: Response) {
    return await this.getAccountUseCase.execute(id, res)
  }
}
