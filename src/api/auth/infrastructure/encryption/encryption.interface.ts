export interface IEncryptionService {
  encrypt(plainText: string): string
  decrypt(encryptedText: string): string
}
