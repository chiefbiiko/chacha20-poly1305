import {
  inspectState,
  rotateLeft,
  numberToFourLittleEndianBytes,
  fourLittleEndianBytesToNumber
} from "./../util/util.ts";

function quarterRound(
  x: Uint32Array,
  a: number,
  b: number,
  c: number,
  d: number
): void {
  x[a] += x[b];
  x[d] = rotateLeft(x[d] ^ x[a], 16);
  x[c] += x[d];
  x[b] = rotateLeft(x[b] ^ x[c], 12);
  x[a] += x[b];
  x[d] = rotateLeft(x[d] ^ x[a], 8);
  x[c] += x[d];
  x[b] = rotateLeft(x[b] ^ x[c], 7);
}

export function chaCha20Block(
  key: Uint8Array,
  nonce: Uint8Array,
  counter: number = 0
): Uint8Array {
  if (key.length !== 32) {
    throw new Error("key must have 256 bits");
  }
  if (nonce.length !== 12) {
    throw new Error("nonce must have 96 bits");
  }
  const out = new Uint8Array(64);
  const state = new Uint32Array(16);
  state[0] = 0x61707865;
  state[1] = 0x3320646e;
  state[2] = 0x79622d32;
  state[3] = 0x6b206574;
  state[4] = fourLittleEndianBytesToNumber(key, 0);
  state[5] = fourLittleEndianBytesToNumber(key, 4);
  state[6] = fourLittleEndianBytesToNumber(key, 8);
  state[7] = fourLittleEndianBytesToNumber(key, 12);
  state[8] = fourLittleEndianBytesToNumber(key, 16);
  state[9] = fourLittleEndianBytesToNumber(key, 20);
  state[10] = fourLittleEndianBytesToNumber(key, 24);
  state[11] = fourLittleEndianBytesToNumber(key, 28);
  state[12] = counter & 0xffffffff;
  state[13] = fourLittleEndianBytesToNumber(nonce, 0);
  state[14] = fourLittleEndianBytesToNumber(nonce, 4);
  state[15] = fourLittleEndianBytesToNumber(nonce, 8);
  const initialState = state.subarray(0, state.length);
  inspectState(state, "state setup with key, nonce, and block counter zero");
  let i: number;
  for (i = 0; i < 10; ++i) {
    quarterRound(state, 0, 4, 8, 12);
    quarterRound(state, 1, 5, 9, 13);
    quarterRound(state, 2, 6, 10, 14);
    quarterRound(state, 3, 7, 11, 15);
    quarterRound(state, 0, 5, 10, 15);
    quarterRound(state, 1, 6, 11, 12);
    quarterRound(state, 2, 7, 8, 13);
    quarterRound(state, 3, 4, 9, 14);
  }
  inspectState(state, "state after 20 rounds");
  for (i = 0; i < 16; ++i) {
    state[i] += initialState[i];
  }
  for (i = 0; i < 16; ++i) {
    numberToFourLittleEndianBytes(out, 4 * i, state[i]);
  }
  return out;
}
