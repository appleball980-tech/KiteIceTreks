import { randomBytes, scrypt as scryptCb, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

// Passwords are hashed with scrypt (memory-hard, built into Node, no native deps).
// Stored format: scrypt$N$r$p$salt$hash (base64url) so parameters can be raised later.
const scrypt = promisify(scryptCb);
const PARAMS = { N: 2 ** 15, r: 8, p: 1 };
const KEY_LENGTH = 64;
const maxmem = 128 * PARAMS.N * PARAMS.r * 2;

export async function hashPassword(password) {
  const salt = randomBytes(16);
  const hash = await scrypt(password, salt, KEY_LENGTH, { ...PARAMS, maxmem });
  return ['scrypt', PARAMS.N, PARAMS.r, PARAMS.p, salt.toString('base64url'), hash.toString('base64url')].join('$');
}

export async function verifyPassword(password, stored) {
  const [algo, N, r, p, salt, hash] = stored.split('$');
  if (algo !== 'scrypt') return false;
  const expected = Buffer.from(hash, 'base64url');
  const actual = await scrypt(password, Buffer.from(salt, 'base64url'), expected.length, {
    N: Number(N), r: Number(r), p: Number(p), maxmem: 128 * Number(N) * Number(r) * 2,
  });
  return timingSafeEqual(actual, expected);
}

// Used when the email doesn't exist, so the response time doesn't reveal which emails are registered
export const DUMMY_HASH = await hashPassword(randomBytes(16).toString('hex'));
