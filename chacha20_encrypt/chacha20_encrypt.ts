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

export function chaCha20Encrypt(
  key: Uint8Array,
  nonce: Uint8Array,
  counter: number,
  plaintext: Uint8Array,
  out: Uint8Array
): void {
  if (out.length !== plaintext.length) {
    throw new TypeError("out.length must equal plaintext.length");
  }
  const loopEnd: number = Math.floor(plaintext.length / 64);
  const rmd: number = plaintext.length % 64;
  const keyChunk: Uint8Array = new Uint8Array(64);
  let plaintextOffset: number = 0;
  let outOffset: number = 0;
  let i: number;
  for (i = 0; i < loopEnd; ++i, plaintextOffset = i * 64, outOffset += 64) {
    chaCha20Block(key, nonce, counter + i, keyChunk);
    xor(
      plaintext.subarray(plaintextOffset, plaintextOffset + 64),
      keyChunk,
      64,
      out,
      outOffset
    );
  }
  if (rmd) {
    chaCha20Block(key, nonce, counter + loopEnd, keyChunk);
    xor(
      plaintext.subarray(loopEnd * 64, plaintext.length),
      keyChunk,
      rmd,
      out,
      outOffset
    );
  }
}
