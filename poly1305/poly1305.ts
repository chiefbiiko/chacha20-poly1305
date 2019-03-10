import { poly1305ClampBigInt } from "./../poly1305_clamp/poly1305_clamp.ts";
import {
  littleEndianBytesToBigInt,
  bigintToSixteenLittleEndianBytes
} from "./../util/util.ts";

/*
poly1305_mac(msg, key):
   r = le_bytes_to_num(key[0..15])
   clamp(r)
   s = le_bytes_to_num(key[16..31])
   a = 0
   p = (1<<130)-5
   for i=1 upto ceil(msg length in bytes / 16)
      n = le_bytes_to_num(msg[((i-1)*16)..(i*16)] | [0x01])
      a += n
      a = (r * a) % p
      end
   a += s
   return num_to_16_le_bytes(a)
   end
*/

export function poly1305(
  otk: Uint8Array,
  msg: Uint8Array,
  out: Uint8Array
): void {
  if (out.length !== 16) {
    throw new TypeError("out must have 16 bytes");
  }
  const r: bigint = poly1305ClampBigInt(littleEndianBytesToBigInt(otk.subarray(0, 16), 0, 16));
  const s: bigint = littleEndianBytesToBigInt(otk.subarray(16, 32), 0, 16);
  const prime: bigint = BigInt(2 ** 130 - 5);
  let acc: bigint = BigInt(0);
  const block: Uint8Array = new Uint8Array(17);
  const loopEnd: number = Math.ceil(msg.length / 16);
  for (let i: number = 1; i <= loopEnd; ++i) {
    block.set(msg.subarray(((i - 1) * 16), (i * 16)), 0);
    block.fill(0x01, 16, 17);
    const b: bigint = littleEndianBytesToBigInt(block, 0, 17);
    acc = (r * (acc + b)) % prime;
  }
  acc += s;
  bigintToSixteenLittleEndianBytes(acc, out);
}
