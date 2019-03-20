import { poly1305KeyGen } from "./poly1305_key_gen/poly1305_key_gen.ts";
import { chaCha20Cipher } from "./chacha20_cipher/chacha20_cipher.ts";
import { zeroPad16 } from "./zero_pad16/zero_pad16.ts";
import { poly1305 } from "./poly1305/poly1305.ts";
import { numberToLittleEndianBytes, inspect } from "./util/util.ts";
import { constantTimeEqual } from "./constant_time_equal/constant_time_equal.ts";

export const KEY_BYTES: number = 32;
export const NONCE_BYTES: number = 12;
export const PLAINTEXT_BYTES_MAX: bigint = 274877906880n;
export const CIPHERTEXT_BYTES_MAX: bigint = 274877906896n;
export const AAD_BYTES_MAX: bigint = 18446744073709551615n;
export const TAG_BYTES: number = 16;

function writePac(ciphertext: Uint8Array, aad: Uint8Array): Uint8Array {
  const paddedCiphertext: Uint8Array = zeroPad16(ciphertext);
  const paddedAad: Uint8Array = zeroPad16(aad);
  const pac: Uint8Array = new Uint8Array(
    paddedAad.length + paddedCiphertext.length + 16
  );
  pac.set(paddedAad, 0);
  pac.set(paddedCiphertext, paddedAad.length);
  numberToLittleEndianBytes(
    aad.length,
    pac,
    8,
    paddedAad.length + paddedCiphertext.length
  );
  numberToLittleEndianBytes(
    ciphertext.length,
    pac,
    8,
    paddedAad.length + paddedCiphertext.length + 8
  );
  return pac;
}

export function aeadChaCha20Poly1305Seal(
  key: Uint8Array,
  nonce: Uint8Array,
  plaintext: Uint8Array,
  aad: Uint8Array
): { ciphertext: Uint8Array; tag: Uint8Array } {
  if (key.length !== KEY_BYTES) {
    throw new TypeError(`key must have ${KEY_BYTES} bytes`);
  }
  if (nonce.length !== NONCE_BYTES) {
    throw new TypeError(`nonce must have ${NONCE_BYTES} bytes`);
  }
  if (plaintext.length > PLAINTEXT_BYTES_MAX) {
    throw new TypeError(`plaintext must not have more than ${PLAINTEXT_BYTES_MAX} bytes`);
  }
  if (aad.length > AAD_BYTES_MAX) {
    throw new TypeError(`aad must not have more than ${AAD_BYTES_MAX} bytes`);
  }
  const otk: Uint8Array = poly1305KeyGen(key, nonce);
  const ciphertext: Uint8Array = chaCha20Cipher(key, nonce, 1, plaintext);
  const pac: Uint8Array = writePac(ciphertext, aad);
  const tag: Uint8Array = poly1305(otk, pac);
  return { ciphertext, tag };
}

export function aeadChaCha20Poly1305Open(
  key: Uint8Array,
  nonce: Uint8Array,
  ciphertext: Uint8Array,
  aad: Uint8Array,
  receivedTag: Uint8Array
): Uint8Array {
  if (key.length !== KEY_BYTES) {
    throw new TypeError(`key must have ${KEY_BYTES} bytes`);
  }
  if (nonce.length !== NONCE_BYTES) {
    throw new TypeError(`nonce must have ${NONCE_BYTES} bytes`);
  }
  if (ciphertext.length > CIPHERTEXT_BYTES_MAX) {
    throw new TypeError(`plaintext must not have more than ${PLAINTEXT_BYTES_MAX} bytes`);
  }
  if (aad.length > AAD_BYTES_MAX) {
    throw new TypeError(`aad must not have more than ${AAD_BYTES_MAX} bytes`);
  }
  if (receivedTag.length !== TAG_BYTES) {
    throw new TypeError(`receivedTag must have ${TAG_BYTES} bytes`);
  }
  const otk: Uint8Array = poly1305KeyGen(key, nonce);
  const pac: Uint8Array = writePac(ciphertext, aad);
  const tag: Uint8Array = poly1305(otk, pac);
  if (!constantTimeEqual(receivedTag, tag)) {
    throw new Error("Tag mismatch");
  }
  return chaCha20Cipher(key, nonce, 1, ciphertext);
}
