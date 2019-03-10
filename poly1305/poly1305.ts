import { poly1305ClampBigInt } from "./../poly1305_clamp/poly1305_clamp.ts";
import {
  littleEndianBytesToBigInt,
  bigIntToLittleEndianBytes,
  swapBigInt
} from "./../util/util.ts";

function writePoly1305Block(
  msg: Uint8Array,
  end: number,
  block: Uint8Array
): void {
  let loopEnd: number = 17;
  let j: number = end - 1;
  const exc: number = end - msg.length;
  if (exc > 0) {
    loopEnd -= exc;
    j = end - exc - 1;
    block.fill(0x00, 17 - exc, block.length);
  }
  block[0] = 0x01;
  for (let i: number = 1; i < loopEnd; ++i, --j) {
    block[i] = msg[j];
  }
}

export const PRIME1305: bigint = 2n ** 130n - 5n;

export function poly1305(
  otk: Uint8Array,
  msg: Uint8Array
): Uint8Array {
  if (otk.length !== 32) {
    throw new TypeError("otk must have 32 bytes");
  }
  const out: Uint8Array = new Uint8Array(16);
  const r: bigint = poly1305ClampBigInt(
    littleEndianBytesToBigInt(otk.subarray(0, 16))
  );
  const s: bigint = littleEndianBytesToBigInt(otk.subarray(16, 32));
  const block: Uint8Array = new Uint8Array(17);
  let acc: bigint = 0n;
  let b: bigint;
  const loopEnd: number = Math.ceil(msg.length / 16);
  for (let i: number = 1; i <= loopEnd; ++i) {
    writePoly1305Block(msg, i * 16, block);
    b = swapBigInt(littleEndianBytesToBigInt(block));
    acc = (r * (acc + b)) % PRIME1305;
  }
  bigIntToLittleEndianBytes(acc + s, out, 16);
  return out;
}
