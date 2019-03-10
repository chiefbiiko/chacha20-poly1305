import { test, assert, runIfMain } from "https://deno.land/std/testing/mod.ts";
import { poly1305 } from "./poly1305.ts";
import { hex2bin } from "./../util/util.ts";

const { readFileSync } = Deno;

export function loadTestVector(): {
  otk: Uint8Array;
  msg: Uint8Array;
  expected: Uint8Array;
} {
  const testVector = JSON.parse(
    new TextDecoder().decode(readFileSync("./poly1305_test_vector.json"))
  );
  return {
    otk: hex2bin(testVector.otk),
    msg: hex2bin(testVector.msg),
    expected: hex2bin(testVector.expected)
  };
}

test(function poly1305Macing(): void {
  const { otk, msg, expected } = loadTestVector();
  const actual: Uint8Array = poly1305(otk, msg);
  assert.equal(actual, expected);
});

runIfMain(import.meta);
