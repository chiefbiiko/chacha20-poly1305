import { poly1305KeyGen } from "./poly1305_key_gen/poly1305_key_gen.ts";
import { chaCha20Cipher } from "./chacha20_cipher/chacha20_cipher.ts";
import { zeroPad16 } from "./zero_pad16/zero_pad16.ts";
import { poly1305 } from "./poly1305/poly1305.ts";
import { numberToLittleEndianBytes } from "./util/util.ts";

/** Last 12 bytes of a 13-char timestamp (ms) */
function defaultNonce() {
  return new TextEncoder().encode(String(Date.now()).slice(-12));
}

/**
chacha20_aead_encrypt(aad, key, iv, constant, plaintext):
    nonce = constant | iv
    otk = poly1305_key_gen(key, nonce)
    ciphertext = chacha20_encrypt(key, 1, nonce, plaintext)
    mac_data = aad | pad16(aad)
    mac_data |= ciphertext | pad16(ciphertext)
    mac_data |= num_to_8_le_bytes(aad.length)
    mac_data |= num_to_8_le_bytes(ciphertext.length)
    tag = poly1305_mac(mac_data, otk)
    return (ciphertext, tag)
*/

export function aeadChaCha20Poly1305Encrypt(
  key: Uint8Array,
  nonce: Uint8Array = defaultNonce(),
  plaintext: Uint8Array,
  aad: Uint8Array
): { ciphertext: Uint8Array, tag: Uint8Array } {
  if (key.length !== 32) {
    throw new TypeError("key must have 32 bytes");
  }
  if (nonce.length !== 12) {
    throw new TypeError("nonce must have 12 bytes");
  }
  const otk: Uint8Array = poly1305KeyGen(key, nonce);
  const ciphertext: Uint8Array = chaCha20Cipher(key, nonce, 1, plaintext);
  
  return { ciphertext, tag };
}