import { poly1305KeyGen } from "./poly1305_key_gen/poly1305_key_gen.ts";
import { chaCha20Cipher } from "./chacha20_cipher/chacha20_cipher.ts";
import { zeroPad16 } from "./zero_pad16/zero_pad16.ts";
import { poly1305 } from "./poly1305/poly1305.ts";
import { numberToLittleEndianBytes, inspect } from "./util/util.ts";

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

export function aeadChaCha20Poly1305Seal(
  key: Uint8Array,
  iv: Uint8Array,
  constant: Uint8Array,
  plaintext: Uint8Array,
  aad: Uint8Array
): { ciphertext: Uint8Array; tag: Uint8Array } {
  if (key.length !== 32) {
    throw new TypeError("key must have 32 bytes");
  }
  if (iv.length !== 8) {
    throw new TypeError("iv must have 8 bytes");
  }
  if (constant.length !== 4) {
    throw new TypeError("constant must have 4 bytes");
  }
  const nonce: Uint8Array = new Uint8Array(12);
  nonce.set(constant, 0);
  nonce.set(iv, 4);
  const otk: Uint8Array = poly1305KeyGen(key, nonce);
inspect(otk, "otk")
  const ciphertext: Uint8Array = chaCha20Cipher(key, nonce, 1, plaintext);
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
inspect(pac, "pac")
  const tag: Uint8Array = poly1305(otk, pac);
inspect(tag, "tag")
  return { ciphertext, tag };
}
