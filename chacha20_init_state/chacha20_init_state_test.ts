import { test, runIfMain } from "https://deno.land/std/testing/mod.ts";
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import { chaCha20InitState } from "./chacha20_init_state.ts";
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
  expected: Uint32Array;
}

function loadTestVectors(): TestVector[] {
  return JSON.parse(
    new TextDecoder().decode(
      readFileSync(`${DIRNAME}/chacha20_init_state_test_vectors.json`)
    )
  ).map(
    (testVector: { [key: string]: any }): TestVector => ({
      key: hex2bytes(testVector.key),
      nonce: hex2bytes(testVector.nonce),
      counter: testVector.counter,
      expected: Uint32Array.from(testVector.expected)
    })
  );
}

const testVectors: TestVector[] = loadTestVectors();

test(function chaCha20InitStateConstants(): void {
  const constants: Uint32Array = Uint32Array.from([
    0x61707865,
    0x3320646e,
    0x79622d32,
    0x6b206574
  ]);
  
  for (const { key, nonce, counter } of testVectors) {
    const initialState: Uint32Array = chaCha20InitState(key, nonce, counter);
    assertEquals(initialState.length, 16);
    assertEquals(initialState.subarray(0, 4), constants);
  }
});

test(function chaCha20InitStateBasic(): void {
  for (const { key, nonce, counter, expected } of testVectors) {
    assertEquals(chaCha20InitState(key, nonce, counter), expected);
  }
});

runIfMain(import.meta, { parallel: true });
