import { test, assert, runIfMain } from "https://deno.land/std/testing/mod.ts";
import { chaCha20Block } from "./chacha20_block.ts";
import { hex2bin } from "./../util/util.ts";

const { readFileSync } = Deno;

export function loadTestVector(): {
  key: Uint8Array;
  nonce: Uint8Array;
  counter: number;
  expected: Uint8Array;
} {
  const testVector = JSON.parse(
    new TextDecoder().decode(readFileSync("./chacha20_block_test_vector.json"))
  );
  return {
    key: hex2bin(testVector.key),
    nonce: hex2bin(testVector.nonce),
    counter: testVector.counter,
    expected: hex2bin(testVector.expected)
  };
}

test(function chaCha20Blocking(): void {
  const { key, nonce, counter, expected } = loadTestVector();
  const actual: Uint8Array = new Uint8Array(64);
  chaCha20Block(key, nonce, counter, actual);
  assert.equal(actual, expected);
});

runIfMain(import.meta);
