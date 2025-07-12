import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

// Encryption configuration
const ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32; // 256 bits
const IV_LENGTH = 16; // 128 bits
const TAG_LENGTH = 16; // 128 bits

// Encrypted data interface
interface EncryptedData {
  encrypted: string;
  iv: string;
  tag: string;
}

// Encryption service class
export class EncryptionService {
  private key: Buffer;

  constructor(encryptionKey: string) {
    if (!encryptionKey || encryptionKey.length < 32) {
      throw new Error('Encryption key must be at least 32 characters long');
    }
    this.key = Buffer.from(encryptionKey.slice(0, 32), 'utf8');
  }

  // Encrypt sensitive data
  async encrypt(data: string): Promise<EncryptedData> {
    const iv = randomBytes(IV_LENGTH);
    const cipher = createCipheriv(ALGORITHM, this.key, iv);
    
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const tag = cipher.getAuthTag();
    
    return {
      encrypted,
      iv: iv.toString('hex'),
      tag: tag.toString('hex'),
    };
  }

  // Decrypt sensitive data
  async decrypt(encryptedData: EncryptedData): Promise<string> {
    const iv = Buffer.from(encryptedData.iv, 'hex');
    const tag = Buffer.from(encryptedData.tag, 'hex');
    const encrypted = Buffer.from(encryptedData.encrypted, 'hex');
    
    const decipher = createDecipheriv(ALGORITHM, this.key, iv);
    decipher.setAuthTag(tag);
    
    let decrypted = decipher.update(encrypted, undefined, 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }

  // Encrypt object (for complex data structures)
  async encryptObject<T>(obj: T): Promise<EncryptedData> {
    const jsonString = JSON.stringify(obj);
    return this.encrypt(jsonString);
  }

  // Decrypt object
  async decryptObject<T>(encryptedData: EncryptedData): Promise<T> {
    const jsonString = await this.decrypt(encryptedData);
    return JSON.parse(jsonString);
  }

  // Hash sensitive data (one-way encryption)
  async hash(data: string, salt?: string): Promise<{ hash: string; salt: string }> {
    const usedSalt = salt || randomBytes(16).toString('hex');
    const hash = await scryptAsync(data, usedSalt, 64) as Buffer;
    return {
      hash: hash.toString('hex'),
      salt: usedSalt,
    };
  }

  // Verify hash
  async verifyHash(data: string, hash: string, salt: string): Promise<boolean> {
    const { hash: computedHash } = await this.hash(data, salt);
    return computedHash === hash;
  }
}

// Global encryption service instance
let encryptionService: EncryptionService | null = null;

export function getEncryptionService(): EncryptionService {
  if (!encryptionService) {
    const key = process.env.ENCRYPTION_KEY;
    if (!key) {
      throw new Error('ENCRYPTION_KEY environment variable is required');
    }
    encryptionService = new EncryptionService(key);
  }
  return encryptionService;
}

// Utility functions for common encryption tasks
export async function encryptSensitiveField(value: string): Promise<EncryptedData> {
  const service = getEncryptionService();
  return service.encrypt(value);
}

export async function decryptSensitiveField(encryptedData: EncryptedData): Promise<string> {
  const service = getEncryptionService();
  return service.decrypt(encryptedData);
}

export async function encryptUserData(data: {
  phone?: string;
  email?: string;
  address?: string;
  [key: string]: any;
}): Promise<{
  encrypted: EncryptedData;
  fields: string[];
}> {
  const service = getEncryptionService();
  const sensitiveFields = ['phone', 'email', 'address'];
  const encryptedFields: string[] = [];
  
  const dataToEncrypt: any = {};
  
  for (const field of sensitiveFields) {
    if (data[field]) {
      dataToEncrypt[field] = data[field];
      encryptedFields.push(field);
      delete data[field];
    }
  }
  
  const encrypted = await service.encryptObject(dataToEncrypt);
  
  return {
    encrypted,
    fields: encryptedFields,
  };
}

export async function decryptUserData(encryptedData: EncryptedData): Promise<any> {
  const service = getEncryptionService();
  return service.decryptObject(encryptedData);
}

// Field-level encryption for Firestore
export function createEncryptedField(fieldName: string) {
  return {
    async set(value: string) {
      const encrypted = await encryptSensitiveField(value);
      return {
        [`${fieldName}_encrypted`]: encrypted.encrypted,
        [`${fieldName}_iv`]: encrypted.iv,
        [`${fieldName}_tag`]: encrypted.tag,
      };
    },
    
    async get(data: any): Promise<string | null> {
      const encrypted = data[`${fieldName}_encrypted`];
      const iv = data[`${fieldName}_iv`];
      const tag = data[`${fieldName}_tag`];
      
      if (!encrypted || !iv || !tag) {
        return null;
      }
      
      try {
        return await decryptSensitiveField({ encrypted, iv, tag });
      } catch (error) {
        console.error(`Failed to decrypt field ${fieldName}:`, error);
        return null;
      }
    },
  };
}

// PII (Personally Identifiable Information) detection and masking
export function maskPII(text: string): string {
  // Email masking
  text = text.replace(/([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g, (match, local, domain) => {
    const maskedLocal = local.length > 2 ? local[0] + '*'.repeat(local.length - 2) + local[local.length - 1] : local;
    return `${maskedLocal}@${domain}`;
  });
  
  // Phone number masking
  text = text.replace(/(\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g, (match) => {
    return match.replace(/\d(?=\d{4})/g, '*');
  });
  
  // Credit card masking
  text = text.replace(/\b\d{4}[-.\s]?\d{4}[-.\s]?\d{4}[-.\s]?\d{4}\b/g, (match) => {
    return match.replace(/\d(?=\d{4})/g, '*');
  });
  
  return text;
}

// Data anonymization for analytics
export function anonymizeData(data: any): any {
  const anonymized = { ...data };
  
  // Remove or hash sensitive fields
  const sensitiveFields = ['email', 'phone', 'address', 'name', 'userId'];
  
  for (const field of sensitiveFields) {
    if (anonymized[field]) {
      anonymized[field] = `hash_${Buffer.from(anonymized[field]).toString('base64').slice(0, 8)}`;
    }
  }
  
  return anonymized;
} 