import { test, runIfMain } from "https://deno.land/std/testing/mod.ts";
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import { chaCha20Block } from "./chacha20_block.ts";
import { hex2bytes } from "./../util/util.ts";

const {
  readFileSync,
  platform: { os }
} = Deno;

const DIRNAME =
  (os !== "win" ? "/" : "") +
  import.meta.url.replace(/^file:\/+|\/[^/]+$/g, "");

interface TestVector {
  key: Uint8Array;
  nonce: Uint8Array;
  counter: number;
  expected: Uint8Array;
}

function loadTestVectors(): TestVector[] {
  const testVectors = JSON.parse(
    new TextDecoder().decode(
      readFileSync(`${DIRNAME}/chacha20_block_test_vectors.json`)
    )
  );
  return testVectors.map(
    (testVector: { [key: string]: any }): TestVector => ({
      key: hex2bytes(testVector.key),
      nonce: hex2bytes(testVector.nonce),
      counter: testVector.counter,
      expected: hex2bytes(testVector.expected)
    })
  );
}

test(function chaCha20BlockBasic(): void {
  const actual: Uint8Array = new Uint8Array(64);
  for (const { key, nonce, counter, expected } of loadTestVectors()) {
    chaCha20Block(key, nonce, counter, actual);
    assertEquals(actual, expected);
  }
});

test(function chaCha20BlockAcceptsExternalState(): void {
  const actual: Uint8Array = new Uint8Array(64);
  const state: Uint32Array = new Uint32Array(16);
  let initialState: Uint32Array;
  for (const { key, nonce, counter, expected } of loadTestVectors()) {
    chaCha20Block(key, nonce, counter, actual, state, initialState);
    assertEquals(actual, expected);
  }
});

runIfMain(import.meta);
