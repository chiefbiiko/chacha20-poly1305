import { test, assert, runIfMain } from "https://deno.land/std/testing/mod.ts";
import { poly1305KeyGen } from "./poly1305_key_gen.ts";
import { hex2bin } from "./../util/util.ts";

const { readFileSync } = Deno;

export function loadTestVector(): {
  key: Uint8Array;
  nonce: Uint8Array;
  expected: Uint8Array;
} {
  const testVector = JSON.parse(
    new TextDecoder().decode(
      readFileSync("./poly1305_key_gen_test_vector.json")
    )
  );
  return {
    key: hex2bin(testVector.key),
    nonce: hex2bin(testVector.nonce),
    expected: hex2bin(testVector.expected)
  };
}

test(function poly1305KeyGeneration(): void {
  const { key, nonce, expected } = loadTestVector();
  const otk: Uint8Array = poly1305KeyGen(key, nonce);
  assert.equal(otk, expected);
});

runIfMain(import.meta);
