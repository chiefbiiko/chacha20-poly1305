import { test, assert, runIfMain } from "https://deno.land/std/testing/mod.ts";
import { chaCha20Cipher } from "./chacha20_cipher.ts";
import { hex2bin } from "./../util/util.ts";

const { readFileSync } = Deno;

const DIRNAME = import.meta.url.replace(/^file:\/+|\/[^/]+$/g, "");

interface TestVector {
  key: Uint8Array;
  nonce: Uint8Array;
  counter: number;
  plaintext: Uint8Array;
  ciphertext: Uint8Array;
}

function loadTestVectors(): TestVector[] {
  const testVectors = JSON.parse(
    new TextDecoder().decode(
      readFileSync(`${DIRNAME}/chacha20_cipher_test_vectors.json`)
    )
  );
  return testVectors.map((testVector: { [key: string]: any }): TestVector => ({
    key: hex2bin(testVector.key),
    nonce: hex2bin(testVector.nonce),
    counter: testVector.counter,
    plaintext: hex2bin(testVector.plaintext),
    ciphertext: hex2bin(testVector.ciphertext)
  }));
}

const testVectors: TestVector[] = loadTestVectors();

test(function chaCha20Encryption(): void {
  for (const { key, nonce, counter, plaintext, ciphertext } of testVectors) {
    assert.equal(chaCha20Cipher(key, nonce, counter, plaintext), ciphertext);
  }
});

test(function chaCha20Decryption(): void {
  for (const { key, nonce, counter, plaintext, ciphertext } of testVectors) {
    assert.equal(chaCha20Cipher(key, nonce, counter, ciphertext), plaintext);
  }
});

runIfMain(import.meta, { parallel: true });
