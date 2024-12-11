import { Controller, Get, Inject } from '@nestjs/common'
import { IKeyService } from '@/api/auth/infrastructure/encryption/key.interface'

@Controller('api')
export class KeyController {
  constructor(
    @Inject('IKeyService')
    private readonly keyService: IKeyService
  ) {}

  @Get('public-key')
  getPublicKey() {
    return { publicKey: this.keyService.getPublicKey() }
  }
}
