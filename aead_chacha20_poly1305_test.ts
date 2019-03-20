import { test, assert, runIfMain } from "https://deno.land/std/testing/mod.ts";
import {
  aeadChaCha20Poly1305Seal,
  aeadChaCha20Poly1305Open
} from "./aead_chacha20_poly1305.ts";
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

function loadTestVectors(): TestVector[] {
  const testVectors = JSON.parse(
    new TextDecoder().decode(
      readFileSync("./aead_chacha20_poly1305_test_vectors.json")
    )
  );
  return testVectors.map((testVector: { [key: string]: string }): TestVector => ({
    key: hex2bin(testVector.key),
    nonce: hex2bin(testVector.nonce),
    plaintext: hex2bin(testVector.plaintext),
    aad: hex2bin(testVector.aad),
    ciphertext: hex2bin(testVector.ciphertext),
    tag: hex2bin(testVector.tag)
  }));
}

const testVectors: TestVector[] = loadTestVectors();

test(function aeadChaCha20Poly1305SealBasic(): void {
  for (const {
      key,
      nonce,
      plaintext,
      aad,
      ciphertext,
      tag
    } of testVectors) {
    const actual: {
      ciphertext: Uint8Array;
      tag: Uint8Array;
    } = aeadChaCha20Poly1305Seal(key, nonce, plaintext, aad);
    assert.equal(actual.ciphertext, ciphertext);
    assert.equal(actual.tag, tag);
  }
});

test(function aeadChaCha20Poly1305OpenBasic(): void {
  for (const {
      key,
      nonce,
      plaintext,
      aad,
      ciphertext,
      tag
    } of testVectors) {
    assert.equal(
      aeadChaCha20Poly1305Open(key, nonce, ciphertext, aad, tag),
      plaintext
    );
  }
});

test(function aeadChaCha20Poly1305OpenThrows(): void {
  const receivedTag: Uint8Array = new Uint8Array(16);
  for (const {
      key,
      nonce,
      plaintext,
      aad,
      ciphertext,
      tag
    } of testVectors) {
    assert.throws(
      aeadChaCha20Poly1305Open.bind(null, key, nonce, ciphertext, aad, receivedTag),
      Error
    );
  }
});

runIfMain(import.meta);
