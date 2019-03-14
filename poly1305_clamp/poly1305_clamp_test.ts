import { test, assert, runIfMain } from "https://deno.land/std/testing/mod.ts";
import { poly1305ClampLittleEndianBytes, poly1305ClampLittleEndianBytesLittleEndianBigInt } from "./poly1305_clamp.ts";
import { hex2bin, littleEndianBytesToLittleEndianBigInt } from "./../util/util.ts";

test(function poly1305ClampLittleEndianBytesing(): void {
  const r: Uint8Array = hex2bin("deadbeefdeadbeefdeadbeefdeadbeef");
  poly1305ClampLittleEndianBytes(r);
  for (let i: number = 0; i < 16; ++i) {
    if (i === 3 || i === 7 || i === 11 || i === 15) {
      assert(r[i] < 16);
    } else if (i === 4 || i === 8 || i === 12) {
      assert(r[i] % 4 === 0);
    }
  }
});

test(function poly1305ClampLittleEndianBytesingBigInt(): void {
  let r: Uint8Array = hex2bin("deadbeefdeadbeefdeadbeefdeadbeef");
  poly1305ClampLittleEndianBytes(r);
  const expected: bigint = littleEndianBytesToLittleEndianBigInt(r, 0, 16);
  const rb: bigint = littleEndianBytesToLittleEndianBigInt(hex2bin("deadbeefdeadbeefdeadbeefdeadbeef"), 0, 16);
  const actual: bigint = poly1305ClampLittleEndianBytesLittleEndianBigInt(rb);
  assert.equal(actual, expected);
});

runIfMain(import.meta);
