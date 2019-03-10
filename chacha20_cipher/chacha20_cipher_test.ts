import { test, assert, runIfMain } from "https://deno.land/std/testing/mod.ts";
import { chaCha20Cipher } from "./chacha20_cipher.ts";
import { hex2bin } from "./../util/util.ts";

const { readFileSync } = Deno;

export function loadTestVector(): {
  key: Uint8Array;
  nonce: Uint8Array;
  counter: number;
  plaintext: Uint8Array;
  ciphertext: Uint8Array;
} {
  const testVector = JSON.parse(
    new TextDecoder().decode(
      readFileSync("./chacha20_cipher_test_vector.json")
    )
  );
  return {
    key: hex2bin(testVector.key),
    nonce: hex2bin(testVector.nonce),
    counter: testVector.counter,
    plaintext: hex2bin(testVector.plaintext),
    ciphertext: hex2bin(testVector.ciphertext)
  };
}

test(function chaCha20Encryption(): void {
  const { key, nonce, counter, plaintext, ciphertext } = loadTestVector();
  const actual: Uint8Array = chaCha20Cipher(key, nonce, counter, plaintext);
  assert.equal(actual, ciphertext);
});

test(function chaCha20Decryption(): void {
  const { key, nonce, counter, plaintext, ciphertext } = loadTestVector();
  const actual: Uint8Array = chaCha20Cipher(key, nonce, counter, ciphertext);
  assert.equal(actual, plaintext);
});

runIfMain(import.meta, { parallel: true });
