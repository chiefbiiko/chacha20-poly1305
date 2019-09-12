import { chacha20Block } from "./../chacha20_block/chacha20_block.ts";
import { chacha20InitState } from "./../chacha20_init_state/chacha20_init_state.ts";
import { hchacha20, NONCE_BYTES as HCHACHA20_NONCE_BYTES, OUTPUT_BYTES as HCHACHA20_OUTPUT_BYTES } from "./../hchacha20/hchacha20.ts";
import { xor } from "./../util/util.ts";

export const KEY_BYTES: number = 32;
export const NONCE_BYTES: number = 24;

const CHACHA20_NONCE_BYTES: number = 12;

export function xchacha20(
  out: Uint8Array,
  key: Uint8Array,
  nonce: Uint8Array,
  counter: number,
  text: Uint8Array
): void {
  if (key.byteLength !== KEY_BYTES) {
    // throw new TypeError(`key must have ${KEY_BYTES} bytes`);
    return null;
  }

  if (nonce.byteLength !== NONCE_BYTES) {
    // throw new TypeError(`nonce must have ${NONCE_BYTES} bytes`);
    return null;
  }

  if (counter < 0 || counter % 1) {
    // throw new TypeError("counter must be an unsigned integer");
    return null;
  }
  
  const chacha20Key: Uint8Array = new Uint8Array(HCHACHA20_OUTPUT_BYTES);
  
  hchacha20(chacha20Key, key, nonce.subarray(0, HCHACHA20_NONCE_BYTES));
  
  const chacha20Nonce: Uint8Array = new Uint8Array(CHACHA20_NONCE_BYTES);

  chacha20Nonce.set(nonce.subarray(HCHACHA20_NONCE_BYTES, nonce.byteLength), 4);

  const loopEnd: number = Math.floor(text.byteLength / 64);
  const rmd: number = text.byteLength % 64;

  const keyChunk: Uint8Array = new Uint8Array(64);
  const state: Uint32Array = new Uint32Array(16);
  const initialState: Uint32Array = chacha20InitState(chacha20Key, chacha20Nonce, counter);

  let textOffset: number = 0;
  let outOffset: number = 0;
  let i: number;

  for (i = 0; i < loopEnd; ++i, textOffset = i * 64, outOffset += 64) {
    chacha20Block(keyChunk, null, null, counter + i, state, initialState);
    xor(
      text.subarray(textOffset, textOffset + 64),
      keyChunk,
      64,
      out,
      outOffset
    );
  }

  if (rmd) {
    chacha20Block(keyChunk, null, null, counter + loopEnd, state, initialState);
    xor(
      text.subarray(loopEnd * 64, text.byteLength),
      keyChunk,
      rmd,
      out,
      outOffset
    );
  }

  chacha20Key.fill(0x00, 0, chacha20Key.byteLength);
  keyChunk.fill(0x00, 0, keyChunk.byteLength);
  state.fill(0, 0, state.byteLength);
  initialState.fill(0, 0, initialState.byteLength);
}
