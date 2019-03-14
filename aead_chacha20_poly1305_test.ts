import { test, assert, runIfMain } from "https://deno.land/std/testing/mod.ts";
import { aeadChaCha20Poly1305Seal } from "./aead_chacha20_poly1305.ts";
import { hex2bin } from "./util/util.ts";

const { readFileSync } = Deno;

interface TestVector {
  key: Uint8Array;
  nonce: Uint8Array;
  plaintext: Uint8Array;
  aad: Uint8Array;
  ciphertext: Uint8Array;
  tag: Uint8Array;
}

function loadTestVectors(): { seal: TestVector[], open: TestVector[] } {
  const testVectors = JSON.parse(
    new TextDecoder().decode(
      readFileSync("./aead_chacha20_poly1305_test_vectors.json")
    )
  );
  return {
    seal: testVectors.seal.map((testVector: { [key: string]: string }): TestVector => ({
        key: hex2bin(testVector.key),
        nonce: hex2bin(testVector.nonce),
        plaintext: hex2bin(testVector.plaintext),
        aad: hex2bin(testVector.aad),
        ciphertext: hex2bin(testVector.ciphertext),
        tag: hex2bin(testVector.tag)
      })),
    open: testVectors.open.map((testVector: { [key: string]: string }): TestVector => ({
        key: hex2bin(testVector.key),
        nonce: hex2bin(testVector.nonce),
        plaintext: hex2bin(testVector.plaintext),
        aad: hex2bin(testVector.aad),
        ciphertext: hex2bin(testVector.ciphertext),
        tag: hex2bin(testVector.tag)
      }))
  };
}

const testVectors: { seal: TestVector[], open: TestVector[] } = loadTestVectors();

test(function aeadChaCha20Poly1305Sealing(): void {
  for (const {
      key,
      nonce,
      plaintext,
      aad,
      ciphertext,
      tag
    } of testVectors.seal) {
    const actual: {
      ciphertext: Uint8Array;
      tag: Uint8Array;
    } = aeadChaCha20Poly1305Seal(key, nonce, plaintext, aad);
    assert.equal(actual.ciphertext, ciphertext, "unequal ciphertexts");
    assert.equal(actual.tag, tag, "unequal tags");
  }
});

runIfMain(import.meta);
