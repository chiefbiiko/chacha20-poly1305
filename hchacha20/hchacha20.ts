import { hchacha20InitState } from "./../hchacha20_init_state/hchacha20_init_state.ts";
import { chacha20QuarterRound } from "./../chacha20_quarter_round/chacha20_quarter_round.ts";
import { numberToLittleEndianBytes } from "./../util/util.ts";

/** Hchacha20 key byte length. */
export const KEY_BYTES: number = 32;

/** Hchacha20 nonce byte length. */
export const NONCE_BYTES: number = 16;

/** Hchacha20 constant byte length. */
export const CONSTANT_BYTES: number = 16;

/** Hchacha20 output bytes. */
export const OUTPUT_BYTES: number = 32;

/** Hchacha20 primitive. */
export function hchacha20(
  out: Uint8Array,
  key: Uint8Array,
  nonce: Uint8Array,
  constant?: Uint8Array
): void {
  const state: Uint32Array = hchacha20InitState(key, nonce, constant);

  for (let i: number = 0; i < 10; ++i) {
    chacha20QuarterRound(state, 0, 4, 8, 12);
    chacha20QuarterRound(state, 1, 5, 9, 13);
    chacha20QuarterRound(state, 2, 6, 10, 14);
    chacha20QuarterRound(state, 3, 7, 11, 15);
    chacha20QuarterRound(state, 0, 5, 10, 15);
    chacha20QuarterRound(state, 1, 6, 11, 12);
    chacha20QuarterRound(state, 2, 7, 8, 13);
    chacha20QuarterRound(state, 3, 4, 9, 14);
  }

  for (let i: number = 0; i < 4; ++i) {
    numberToLittleEndianBytes(state[i], out, 4, 4 * i);
    numberToLittleEndianBytes(state[i + 12], out, 4, 4 * i + 16);
  }
}
