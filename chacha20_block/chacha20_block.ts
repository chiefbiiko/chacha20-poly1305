import {
  rotateLeft,
  numberToFourLittleEndianBytes,
  fourLittleEndianBytesToNumber
} from "./../util/util.ts";

function quarterRound(
  state: Uint32Array,
  a: number,
  b: number,
  c: number,
  d: number
): void {
  state[a] += state[b];
  state[d] = rotateLeft(state[d] ^ state[a], 16);
  state[c] += state[d];
  state[b] = rotateLeft(state[b] ^ state[c], 12);
  state[a] += state[b];
  state[d] = rotateLeft(state[d] ^ state[a], 8);
  state[c] += state[d];
  state[b] = rotateLeft(state[b] ^ state[c], 7);
}

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
  const initialState: Uint32Array = Uint32Array.from(state);
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
  for (i = 0; i < 16; ++i) {
    state[i] += initialState[i];
  }
  for (i = 0; i < 16; ++i) {
    numberToFourLittleEndianBytes(out, 4 * i, state[i]);
  }
}
