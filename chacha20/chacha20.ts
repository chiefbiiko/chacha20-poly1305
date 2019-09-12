import { chaCha20Block } from "./../chacha20_block/chacha20_block.ts";
import { chaCha20InitState } from "./../chacha20_init_state/chacha20_init_state.ts";
import { xor } from "./../util/util.ts";

export const KEY_BYTES: number = 32;
export const NONCE_BYTES: number = 12;

export function chaCha20(
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

  const loopEnd: number = Math.floor(text.byteLength / 64);
  const rmd: number = text.byteLength % 64;

  const keyChunk: Uint8Array = new Uint8Array(64);
  const state: Uint32Array = new Uint32Array(16);
  const initialState: Uint32Array = chaCha20InitState(key, nonce, counter);

  let textOffset: number = 0;
  let outOffset: number = 0;
  let i: number;

  for (i = 0; i < loopEnd; ++i, textOffset = i * 64, outOffset += 64) {
    chaCha20Block(keyChunk, null, null, counter + i, state, initialState);
    xor(
      text.subarray(textOffset, textOffset + 64),
      keyChunk,
      64,
      out,
      outOffset
    );
  }

  if (rmd) {
    chaCha20Block(keyChunk, null, null, counter + loopEnd, state, initialState);
    xor(
      text.subarray(loopEnd * 64, text.byteLength),
      keyChunk,
      rmd,
      out,
      outOffset
    );
  }

  keyChunk.fill(0x00, 0, keyChunk.byteLength);
  state.fill(0, 0, state.byteLength);
  initialState.fill(0, 0, initialState.byteLength);
}
