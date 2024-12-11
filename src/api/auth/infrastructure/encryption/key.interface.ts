export interface IKeyService {
  generateAndSaveKeys(): void
  getPublicKey(): string
  getPrivateKey(): string
}
