import { test, runIfMain } from "https://deno.land/std/testing/mod.ts";
import { assert, assertEquals } from "https://deno.land/std/testing/asserts.ts";
import { encode } from "https://denopkg.com/chiefbiiko/std-encoding/mod.ts";
import {
  poly1305ClampLittleEndianBytes,
  poly1305ClampLittleEndianBigInt
} from "./poly1305_clamp.ts";
import { littleEndianBytesToBigInt } from "./../util/util.ts";

test(function poly1305ClampLittleEndianBytesBasic(): void {
  const r: Uint8Array = encode("deadbeefdeadbeefdeadbeefdeadbeef", "hex");

  poly1305ClampLittleEndianBytes(r);

  for (let i: number = 0; i < 16; ++i) {
    if (i === 3 || i === 7 || i === 11 || i === 15) {
      assert(r[i] < 16);
    } else if (i === 4 || i === 8 || i === 12) {
      assert(r[i] % 4 === 0);
    }
  }
});

test({
  name: "poly1305ClampLittleEndianBigInt",
  fn(): void {
    let r: Uint8Array = encode("deadbeefdeadbeefdeadbeefdeadbeef", "hex");

    poly1305ClampLittleEndianBytes(r);

    const expected: bigint = littleEndianBytesToBigInt(r);

    const rb: bigint = littleEndianBytesToBigInt(
      encode("deadbeefdeadbeefdeadbeefdeadbeef", "hex")
    );

    const actual: bigint = poly1305ClampLittleEndianBigInt(rb);

    assertEquals(actual, expected);
  }
});

runIfMain(import.meta, { parallel: true });
