import { chaCha20Block } from "./../chacha20_block/chacha20_block.ts";

export function poly1305KeyGen(key: Uint8Array, nonce: Uint8Array): Uint8Array {
  const out: Uint8Array = new Uint8Array(64);

  chaCha20Block(key, nonce, 0, out);

  return out.subarray(0, 32);
}
