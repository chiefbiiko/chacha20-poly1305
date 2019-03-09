import { poly1305Clamp } from "./../poly1305_clamp/poly1305_clamp.ts";
import {
  littleEndianBytesToBigInt,
  bigintToSixteenLittleEndianBytes
} from "./../util/util.ts";

function splitKey(otk: Uint8Array): { r: Uint8Array; s: Uint8Array } {
  return { r: otk.subarray(0, 16), s: otk.subarray(16, 32) };
}

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
  const { r, s }: { r: Uint8Array; s: Uint8Array } = splitKey(otk);
  poly1305Clamp(r);
  const prime: bigint = BigInt(2 ** 130 - 5);
  let acc: bigint = BigInt(0);
  const loopEnd: number = Math.ceil(msg.length / 16);
  for (let i: number = 1; i <= loopEnd; ++i) {
    
  }
  acc += s;
}

poly1305(new Uint8Array(32), new Uint8Array(5), new Uint8Array(5));
