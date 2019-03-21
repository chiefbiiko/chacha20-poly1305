import { test, runIfMain } from "https://deno.land/std/testing/mod.ts";
import { assert, assertEquals } from "https://deno.land/std/testing/asserts.ts";
import { poly1305ClampLittleEndianBytes, poly1305ClampLittleEndianBigInt } from "./poly1305_clamp.ts";
import { hex2bin, littleEndianBytesToBigInt } from "./../util/util.ts";

test(function poly1305ClampLittleEndianBytesBasic(): void {
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

test(function poly1305ClampLittleEndianBigIntBasic(): void {
  let r: Uint8Array = hex2bin("deadbeefdeadbeefdeadbeefdeadbeef");
  poly1305ClampLittleEndianBytes(r);
  const expected: bigint = littleEndianBytesToBigInt(r);
  const rb: bigint = littleEndianBytesToBigInt(hex2bin("deadbeefdeadbeefdeadbeefdeadbeef"));
  const actual: bigint = poly1305ClampLittleEndianBigInt(rb);
  assertEquals(actual, expected);
});

runIfMain(import.meta);
