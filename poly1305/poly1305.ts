import { poly1305ClampBigInt } from "./../poly1305_clamp/poly1305_clamp.ts";
import {
  littleEndianBytesToBigInt,
  bigIntToLittleEndianBytes,
  swapBigInt,
  // bigIntToNumber
} from "./../util/util.ts";

function writeBlock(msg: Uint8Array, o: number, end: number, block: Uint8Array): void {
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

// function mod(a: bigint, b: bigint): bigint {
//   const q: bigint = BigInt(Math.floor(bigIntToNumber(a / b)));
//   return a - q * b;
// }

export const PRIME1305: bigint = 2n ** 130n - 5n;

export function poly1305(
  otk: Uint8Array,
  msg: Uint8Array,
  out: Uint8Array
): void {
  if (otk.length !== 32) {
    throw new TypeError("otk must have 32 bytes")
  }
  if (out.length !== 16) {
    throw new TypeError("out must have 16 bytes");
  }
  const r: bigint = poly1305ClampBigInt(
    littleEndianBytesToBigInt(otk.subarray(0, 16))
  );
// console.error("r", r.toString(16))
  const s: bigint = littleEndianBytesToBigInt(otk.subarray(16, 32));
  const block: Uint8Array = new Uint8Array(17);
  let acc: bigint = 0n;
  let b: bigint;
  const loopEnd: number = Math.ceil(msg.length / 16);
  for (let i: number = 1; i <= loopEnd; ++i) {
    writeBlock(msg, (i - 1) * 16, i * 16, block);
// console.error(`\nblock`, Array.from(block).map(b=>b.toString(16)).join(''), "\n")
    b = swapBigInt(littleEndianBytesToBigInt(block));
console.error("\nblock b.toString(16)", b.toString(16), "\n")
// console.error("\nswapBigInt(acc + b).toString(16)", swapBigInt(acc + b).toString(16), "\n")
// console.error("\n(r * swapBigInt(acc + b)).toString(16)", (r * swapBigInt(acc + b)).toString(16), "\n")
    acc = (r * (acc + b)) % PRIME1305;
console.error(`\ni: ${i}; acc: ${acc.toString(16)}\n`)
  }
  acc += s;
  // acc = acc + s;
  bigIntToLittleEndianBytes(acc, out, 16);
}
