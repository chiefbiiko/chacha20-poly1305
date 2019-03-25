import { test, runIfMain } from "https://deno.land/std/testing/mod.ts";
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import { chaCha20Block, chaCha20InitState } from "./chacha20_block.ts";
import { hex2bin } from "./../util/util.ts";

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
      key: hex2bin(testVector.key),
      nonce: hex2bin(testVector.nonce),
      counter: testVector.counter,
      expected: hex2bin(testVector.expected)
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

test(function chaCha20InitStateBasic(): void {
  const constants: Uint32Array = Uint32Array.from([
    0x61707865,
    0x3320646e,
    0x79622d32,
    0x6b206574
  ]);
  for (const { key, nonce, counter } of loadTestVectors()) {
    const initialState: Uint32Array = chaCha20InitState(key, nonce, counter);
    assertEquals(initialState.length, 16);
    assertEquals(initialState.subarray(0, 4), constants);
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
