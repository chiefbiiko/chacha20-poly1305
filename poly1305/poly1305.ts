import { poly1305ClampLittleEndianBigInt } from "./../poly1305_clamp/poly1305_clamp.ts";
import {
  littleEndianBytesToBigInt,
  BigIntToSixteenLittleEndianBytes
} from "./../util/util.ts";
import { poly1305MsgBlockToBigInt } from "./../poly1305_msg_block_to_big_int/poly1305_msg_block_to_big_int.ts";

export const PRIME1305: bigint = 2n ** 130n - 5n;
export const KEY_BYTES: number = 32;
export const TAG_BYTES: number = 16;

export function poly1305(otk: Uint8Array, msg: Uint8Array): Uint8Array {
  if (otk.byteLength !== KEY_BYTES) {
    // throw new TypeError(`otk must have ${KEY_BYTES} bytes`);
    return null;
  }

  const tag: Uint8Array = new Uint8Array(TAG_BYTES);

  const r: bigint = poly1305ClampLittleEndianBigInt(
    littleEndianBytesToBigInt(otk.subarray(0, 16))
  );

  const s: bigint = littleEndianBytesToBigInt(otk.subarray(16, 32));

  const loopEnd: number = Math.ceil(msg.byteLength / 16);

  let acc: bigint = 0n;

  for (let i: number = 1; i <= loopEnd; ++i) {
    acc = (r * (acc + poly1305MsgBlockToBigInt(msg, i * 16))) % PRIME1305;
  }

  BigIntToSixteenLittleEndianBytes(acc + s, tag);

  return tag;
}
