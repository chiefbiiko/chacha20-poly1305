import { test, runIfMain } from "https://deno.land/std/testing/mod.ts";
import { assert, assertEquals } from "https://deno.land/std/testing/asserts.ts";
import { zeroPad16 } from "./zero_pad16.ts";

test(function zeroPadToMultiplesOf16(): void {
  const x: Uint8Array = new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  const y: Uint8Array = zeroPad16(x);
  assert(y.length % 16 === 0);
  assertEquals(y.subarray(0, x.length), x);
  assert(y.subarray(x.length, y.length).every((b: number) => b === 0x00));
});

runIfMain(import.meta);
