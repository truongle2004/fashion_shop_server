import { Injectable, Logger } from '@nestjs/common'
import * as fs from 'fs'
import * as path from 'path'
import { generateKeyPairSync } from 'crypto'
import { IKeyService } from '@/api/auth/infrastructure/encryption/key.interface'

@Injectable()
export class KeyService implements IKeyService {
  private readonly logger = new Logger(KeyService.name)

  private readonly publicKeyPath = path.join(__dirname, '../../keys/public.pem')
  private readonly privateKeyPath = path.join(
    __dirname,
    '../../keys/private.pem'
  )

  private publicKey: string
  private privateKey: string

  constructor() {
    this.initializeKeys()
  }

  /**
   * Ensures that keys are loaded or generated during service initialization.
   */
  private initializeKeys(): void {
    try {
      if (this.keysExist()) {
        this.loadKeys()
      } else {
        this.generateAndSaveKeys()
      }
    } catch (error) {
      this.logger.error(error.stack)
      this.logger.error('Failed to initialize keys', error)
      throw new Error('Key initialization failed')
    }
  }

  /**
   * Checks if the public and private keys exist.
   */
  private keysExist(): boolean {
    return (
      fs.existsSync(this.publicKeyPath) && fs.existsSync(this.privateKeyPath)
    )
  }

  /**
   * Loads keys from the filesystem.
   */
  private loadKeys(): void {
    try {
      this.publicKey = fs.readFileSync(this.publicKeyPath, 'utf8')
      this.privateKey = fs.readFileSync(this.privateKeyPath, 'utf8')
      this.logger.log('Keys successfully loaded.')
    } catch (error) {
      this.logger.error('Error loading keys from files', error)
      throw new Error('Failed to load keys')
    }
  }

  /**
   * Generates new RSA key pairs and saves them to files.
   */
  generateAndSaveKeys(): void {
    try {
      const { publicKey, privateKey } = generateKeyPairSync('rsa', {
        modulusLength: 2048
      })

      this.publicKey = publicKey.export({
        type: 'pkcs1',
        format: 'pem'
      }) as string
      this.privateKey = privateKey.export({
        type: 'pkcs1',
        format: 'pem'
      }) as string

      fs.mkdirSync(path.dirname(this.publicKeyPath), { recursive: true })

      // Save the keys with restricted permissions
      fs.writeFileSync(this.publicKeyPath, this.publicKey, { mode: 0o600 })
      fs.writeFileSync(this.privateKeyPath, this.privateKey, { mode: 0o600 })

      this.logger.log('New keys successfully generated and saved.')
    } catch (error) {
      this.logger.error('Error generating keys', error)
      throw new Error('Failed to generate keys')
    }
  }

  /**
   * Returns the public key.
   */
  getPublicKey(): string {
    return this.publicKey
  }

  /**
   * Returns the private key.
   */
  getPrivateKey(): string {
    return this.privateKey
  }
}
