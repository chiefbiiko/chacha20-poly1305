import { test, assert, runIfMain } from "https://deno.land/std/testing/mod.ts";
import { chaCha20Block } from "./chacha20_block.ts";
import { hex2bin } from "./../util/util.ts";

const { readFileSync } = Deno;

const DIRNAME = import.meta.url.replace(/^file:\/+|\/[^/]+$/g, "");

interface TestVector {
  key: Uint8Array;
  nonce: Uint8Array;
  counter: number;
  expected: Uint8Array;
}

function loadTestVectors(): TestVector[] {
  const testVectors = JSON.parse(
    new TextDecoder().decode(readFileSync(`${DIRNAME}/chacha20_block_test_vectors.json`))
  );
  return testVectors.map((testVector: { [key: string]: any }): TestVector => ({
    key: hex2bin(testVector.key),
    nonce: hex2bin(testVector.nonce),
    counter: testVector.counter,
    expected: hex2bin(testVector.expected)
  }));
}

test(function chaCha20BlockBasic(): void {
  const actual: Uint8Array = new Uint8Array(64);
  for (const { key, nonce, counter, expected } of loadTestVectors()) {
    chaCha20Block(key, nonce, counter, actual);
    assert.equal(actual, expected);
  }
});

runIfMain(import.meta);
