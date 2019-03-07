import { chaCha20Block } from "./../chaCha20_block/chaCha20_block.ts";

export function poly1305KeyGen(key: Uint8Array, nonce: Uint8Array): Uint8Array {
  return chaCha20Block(key, nonce, 0).subarray(0, 32);
}
