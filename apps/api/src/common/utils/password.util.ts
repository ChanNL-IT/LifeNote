import { randomBytes, scryptSync, timingSafeEqual } from 'crypto';

const KEY_LENGTH = 64;

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, KEY_LENGTH).toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedValue: string): boolean {
  const [salt, storedHash] = storedValue.split(':');
  if (!salt || !storedHash) return false;

  const hashBuffer = Buffer.from(scryptSync(password, salt, KEY_LENGTH).toString('hex'), 'hex');
  const storedHashBuffer = Buffer.from(storedHash, 'hex');

  if (hashBuffer.length !== storedHashBuffer.length) return false;
  return timingSafeEqual(hashBuffer, storedHashBuffer);
}
