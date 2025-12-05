import { createHash, randomBytes } from 'crypto';

const ALGORITHM = 'sha256';
const ENCODING = 'hex';

/**
 * Gera uma API key única
 */
export function generateApiKey(): string {
  const prefix = 'cnpj';
  const randomPart = randomBytes(32).toString('base64url');
  return `${prefix}_${randomPart}`;
}

/**
 * Cria hash de uma API key para armazenamento seguro
 */
export function hashApiKey(apiKey: string): string {
  return createHash(ALGORITHM).update(apiKey).digest(ENCODING);
}

/**
 * Verifica se uma API key corresponde ao hash armazenado
 */
export function verifyApiKey(apiKey: string, hash: string): boolean {
  const apiKeyHash = hashApiKey(apiKey);
  return apiKeyHash === hash;
}
