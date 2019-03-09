import { test, assert, runIfMain } from "https://deno.land/std/testing/mod.ts";
import { chaCha20Encrypt } from "./chacha20_encrypt.ts";
import { hex2bin } from "./../util/util.ts";

const { readFileSync } = Deno;

export function loadTestVector(): {
  key: Uint8Array;
  nonce: Uint8Array;
  counter: number;
  plaintext: Uint8Array;
  expected: Uint8Array;
} {
  const testVector = JSON.parse(
    new TextDecoder().decode(
      readFileSync("./chacha20_encrypt_test_vector.json")
    )
  );
  return {
    key: hex2bin(testVector.key),
    nonce: hex2bin(testVector.nonce),
    counter: testVector.counter,
    plaintext: hex2bin(testVector.plaintext),
    expected: hex2bin(testVector.expected)
  };
}

test(function chaCha20Encryption(): void {
  const { key, nonce, counter, plaintext, expected } = loadTestVector();
  const ciphertext: Uint8Array = new Uint8Array(plaintext.length);
  chaCha20Encrypt(key, nonce, counter, plaintext, ciphertext);
  assert.equal(ciphertext, expected);
});

runIfMain(import.meta);
