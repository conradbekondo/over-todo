import { BinaryLike, scrypt, timingSafeEqual } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify<BinaryLike, BinaryLike, number, Buffer>(scrypt);
const KEY_LENGTH: number = 64;
// const SCRYPT_OPTIONS = { N: 163484, r: 8, p: 1 };
const SEPARATOR = "$$";

export async function hashPassword(password: string, salt: string) {
  const digest = await scryptAsync(password, salt, KEY_LENGTH);
  return [salt, digest.toString("hex")].join(SEPARATOR);
}

export async function verifyPassword(password: string, hash: string) {
  const [salt, digest] = hash.split(SEPARATOR);
  const challenge = await scryptAsync(password, salt, digest.length / 2);
  return timingSafeEqual(challenge, Buffer.from(password));
}
