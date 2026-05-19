const enc = new TextEncoder();
const dec = new TextDecoder();

function randomBytes(n: number): Uint8Array {
  const b = new Uint8Array(n);
  crypto.getRandomValues(b);
  return b;
}

export function toB64(u8: Uint8Array): string {
  let s = '';
  for (let i = 0; i < u8.length; i += 8192) {
    s += String.fromCharCode(...u8.subarray(i, i + 8192));
  }
  return btoa(s);
}

export function fromB64(s: string): Uint8Array {
  const bin = atob(s);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  );
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt as BufferSource,
      iterations: 120_000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

export interface EncryptedPayload {
  saltB64: string;
  ivB64: string;
  ciphertextB64: string;
}

export async function encryptWithPassword(
  password: string,
  plaintext: string
): Promise<EncryptedPayload> {
  const salt = randomBytes(16);
  const iv = randomBytes(12);
  const key = await deriveKey(password, salt);
  const ct = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv as BufferSource },
    key,
    enc.encode(plaintext)
  );
  return {
    saltB64: toB64(salt),
    ivB64: toB64(iv),
    ciphertextB64: toB64(new Uint8Array(ct)),
  };
}

export async function decryptWithPassword(
  password: string,
  payload: EncryptedPayload
): Promise<string> {
  const salt = fromB64(payload.saltB64);
  const iv = fromB64(payload.ivB64);
  const ciphertext = fromB64(payload.ciphertextB64);
  const key = await deriveKey(password, salt);
  const pt = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: iv as BufferSource },
    key,
    ciphertext as BufferSource
  );
  return dec.decode(pt);
}
