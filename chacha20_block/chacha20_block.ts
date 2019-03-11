import {
  chaCha20QuarterRound
} from "./../chacha20_quarter_round/chacha20_quarter_round.ts";

import {
  numberToFourLittleEndianBytes,
  fourLittleEndianBytesToNumber
} from "./../util/util.ts";

const KEY_STATE: Map<Uint8Array, Uint32Array> = new Map();

export function chaCha20Block(
  key: Uint8Array,
  nonce: Uint8Array,
  counter: number,
  out: Uint8Array
): void {
  if (key.length !== 32) {
    throw new TypeError("key must have 32 bytes");
  }
  if (nonce.length !== 12) {
    throw new TypeError("nonce must have 12 bytes");
  }
  if (counter < 0 || counter % 1) {
    throw new TypeError("counter must be an unsigned integer");
  }
  if (out.length !== 64) {
    throw new TypeError("out must have 64 bytes");
  }
  let initialState: Uint32Array;
  if (KEY_STATE.has(key)) {
    initialState = KEY_STATE.get(key);
  } else {
    initialState = new Uint32Array(16);
    initialState[0] = 0x61707865;
    initialState[1] = 0x3320646e;
    initialState[2] = 0x79622d32;
    initialState[3] = 0x6b206574;
    initialState[4] = fourLittleEndianBytesToNumber(key, 0);
    initialState[5] = fourLittleEndianBytesToNumber(key, 4);
    initialState[6] = fourLittleEndianBytesToNumber(key, 8);
    initialState[7] = fourLittleEndianBytesToNumber(key, 12);
    initialState[8] = fourLittleEndianBytesToNumber(key, 16);
    initialState[9] = fourLittleEndianBytesToNumber(key, 20);
    initialState[10] = fourLittleEndianBytesToNumber(key, 24);
    initialState[11] = fourLittleEndianBytesToNumber(key, 28);
    initialState[12] = counter & 0xffffffff;
    initialState[13] = fourLittleEndianBytesToNumber(nonce, 0);
    initialState[14] = fourLittleEndianBytesToNumber(nonce, 4);
    initialState[15] = fourLittleEndianBytesToNumber(nonce, 8);
    KEY_STATE.set(key, initialState);
  }
  const state: Uint32Array = Uint32Array.from(initialState);
  let i: number;
  for (i = 0; i < 10; ++i) {
    chaCha20QuarterRound(state, 0, 4, 8, 12);
    chaCha20QuarterRound(state, 1, 5, 9, 13);
    chaCha20QuarterRound(state, 2, 6, 10, 14);
    chaCha20QuarterRound(state, 3, 7, 11, 15);
    chaCha20QuarterRound(state, 0, 5, 10, 15);
    chaCha20QuarterRound(state, 1, 6, 11, 12);
    chaCha20QuarterRound(state, 2, 7, 8, 13);
    chaCha20QuarterRound(state, 3, 4, 9, 14);
  }
  for (i = 0; i < 16; ++i) {
    state[i] += initialState[i];
  }
  for (i = 0; i < 16; ++i) {
    numberToFourLittleEndianBytes(out, 4 * i, state[i]);
  }
}
