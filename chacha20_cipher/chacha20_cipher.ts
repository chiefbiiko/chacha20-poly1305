import { chaCha20Block } from "./../chacha20_block/chacha20_block.ts";

function xor(
  a: Uint8Array,
  b: Uint8Array,
  length: number,
  c: Uint8Array,
  o: number
): void {
  for (let i: number = 0; i < length; ++i) {
    c[o + i] = a[i] ^ b[i];
  }
}

export function chaCha20Cipher(
  key: Uint8Array,
  nonce: Uint8Array,
  counter: number,
  text: Uint8Array
): Uint8Array {
  const out: Uint8Array = new Uint8Array(text.length);
  const loopEnd: number = Math.floor(text.length / 64);
  const rmd: number = text.length % 64;
  const keyChunk: Uint8Array = new Uint8Array(64);
  let textOffset: number = 0;
  let outOffset: number = 0;
  let i: number;
  for (i = 0; i < loopEnd; ++i, textOffset = i * 64, outOffset += 64) {
    chaCha20Block(key, nonce, counter + i, keyChunk);
    xor(
      text.subarray(textOffset, textOffset + 64),
      keyChunk,
      64,
      out,
      outOffset
    );
  }
  if (rmd) {
    chaCha20Block(key, nonce, counter + loopEnd, keyChunk);
    xor(
      text.subarray(loopEnd * 64, text.length),
      keyChunk,
      rmd,
      out,
      outOffset
    );
  }
  return out;
}
