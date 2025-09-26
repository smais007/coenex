import CryptoJS from 'crypto-js'

export class FileEncryption {
  /**
   * Encrypt file buffer using AES encryption with user password
   */
  static encryptFile(fileBuffer: ArrayBuffer, password: string): ArrayBuffer {
    // Convert ArrayBuffer to WordArray
    const wordArray = CryptoJS.lib.WordArray.create(fileBuffer)
    
    // Encrypt using AES
    const encrypted = CryptoJS.AES.encrypt(wordArray, password).toString()
    
    // Convert back to ArrayBuffer
    const encryptedBytes = CryptoJS.enc.Base64.parse(encrypted)
    return this.wordArrayToArrayBuffer(encryptedBytes)
  }

  /**
   * Decrypt file buffer using AES decryption with user password
   */
  static decryptFile(encryptedBuffer: ArrayBuffer, password: string): ArrayBuffer {
    try {
      // Convert ArrayBuffer to base64 string
      const base64String = this.arrayBufferToBase64(encryptedBuffer)
      
      // Decrypt using AES
      const decryptedBytes = CryptoJS.AES.decrypt(base64String, password)
      
      // Convert back to ArrayBuffer
      return this.wordArrayToArrayBuffer(decryptedBytes)
    } catch {
      throw new Error('Invalid password or corrupted file')
    }
  }

  /**
   * Convert ArrayBuffer to base64 string
   */
  private static arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer)
    let binary = ''
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i])
    }
    return btoa(binary)
  }

  /**
   * Convert WordArray to ArrayBuffer
   */
  private static wordArrayToArrayBuffer(wordArray: CryptoJS.lib.WordArray): ArrayBuffer {
    const arrayOfWords = wordArray.words
    const length = wordArray.sigBytes
    const uInt8Array = new Uint8Array(length)
    
    let offset = 0
    for (let i = 0; i < arrayOfWords.length; i++) {
      const word = arrayOfWords[i]
      for (let j = 3; j >= 0 && offset < length; j--) {
        uInt8Array[offset++] = (word >> (8 * j)) & 0xFF
      }
    }
    
    return uInt8Array.buffer
  }
}