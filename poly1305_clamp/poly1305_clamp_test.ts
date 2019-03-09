import { test, assert, runIfMain } from "https://deno.land/std/testing/mod.ts";
import { poly1305Clamp, poly1305ClampBigInt } from "./poly1305_clamp.ts";
import { hex2bin, littleEndianBytesToBigInt } from "./../util/util.ts";

test(function poly1305Clamping(): void {
  const r: Uint8Array = hex2bin("deadbeefdeadbeefdeadbeefdeadbeef");
  poly1305Clamp(r);
  for (let i: number = 0; i < 16; ++i) {
    if (i === 3 || i === 7 || i === 11 || i === 15) {
      assert(r[i] < 16);
    } else if (i === 4 || i === 8 || i === 12) {
      assert(r[i] % 4 === 0);
    }
  }
});

test(function poly1305ClampingBigInt(): void {
  let r: Uint8Array = hex2bin("deadbeefdeadbeefdeadbeefdeadbeef");
  poly1305Clamp(r);
  const expected: bigint = littleEndianBytesToBigInt(r, 0, 16);
  const rb: bigint = littleEndianBytesToBigInt(hex2bin("deadbeefdeadbeefdeadbeefdeadbeef"), 0, 16);
  const actual: bigint = poly1305ClampBigInt(rb);
  assert.equal(actual, expected);
});

runIfMain(import.meta);
