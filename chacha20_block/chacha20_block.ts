import { chaCha20InitState } from "./../chacha20_init_state/chacha20_init_state.ts";
import { chaCha20QuarterRound } from "./../chacha20_quarter_round/chacha20_quarter_round.ts";
import { numberToLittleEndianBytes } from "./../util/util.ts";

export function chaCha20Block(
  key: Uint8Array,
  nonce: Uint8Array,
  counter: number,
  out: Uint8Array,
  state?: Uint32Array,
  initialState?: Uint32Array
): void {
  if (!state) {
    state = new Uint32Array(16);
  }

  if (!initialState) {
    initialState = chaCha20InitState(key, nonce, counter);
  } else {
    initialState[12] = counter & 0xffffffff;
  }

  state.set(initialState);

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
    numberToLittleEndianBytes(state[i] + initialState[i], out, 4, 4 * i);
  }
}
