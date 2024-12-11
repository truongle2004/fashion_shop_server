import { Inject, Injectable } from '@nestjs/common'
import * as crypto from 'crypto'
import { IEncryptionService } from '@/api/auth/infrastructure/encryption/encryption.interface'
import { IKeyService } from '@/api/auth/infrastructure/encryption/key.interface'

@Injectable()
export class EncryptionService implements IEncryptionService {
  constructor(
    @Inject('IKeyService')
    private readonly keyService: IKeyService
  ) {}

  encrypt(text: string): string {
    const publicKey = this.keyService.getPublicKey()
    const encrypted = crypto.publicEncrypt(publicKey, Buffer.from(text))
    return encrypted.toString('base64')
  }

  decrypt(encryptedText: string): string {
    try {
      const privateKey = this.keyService.getPrivateKey()

      const buffer = Buffer.from(encryptedText, 'base64')

      const decrypted = crypto.privateDecrypt(privateKey, buffer)

      return decrypted.toString() // Return decrypted text
    } catch (error) {
      throw new Error(error)
    }
  }
}
