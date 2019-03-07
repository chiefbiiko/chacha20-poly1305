import { test, assert, runIfMain } from "https://deno.land/std/testing/mod.ts";
import { chaCha20Block } from "./chacha20_block.ts";
import { hex2bin } from "./../util/util.ts";

const { readFileSync } = Deno;

export function loadTestVector(): {
  key: Uint8Array;
  nonce: Uint8Array;
  ibc: number;
  expected: Uint8Array;
} {
  const testVector = JSON.parse(
    new TextDecoder().decode(readFileSync("./test_vector.json"))
  );
  return {
    key: hex2bin(testVector.key),
    nonce: hex2bin(testVector.nonce),
    ibc: testVector.ibc,
    expected: hex2bin(testVector.expected)
  };
}

test(function chaCha20Blocking(): void {
  const { key, nonce, ibc, expected } = loadTestVector();
  const actual: Uint8Array = chaCha20Block(key, nonce, ibc);
  assert.equal(actual, expected);
});

runIfMain(import.meta);