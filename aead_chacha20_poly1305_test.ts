import { test, runIfMain } from "https://deno.land/std/testing/mod.ts";
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import {
  aeadChaCha20Poly1305Seal,
  aeadChaCha20Poly1305Open
} from "./aead_chacha20_poly1305.ts";
import { hex2bytes } from "./util/util.ts";

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
    key: hex2bytes(testVector.key),
    nonce: hex2bytes(testVector.nonce),
    plaintext: hex2bytes(testVector.plaintext),
    aad: hex2bytes(testVector.aad),
    ciphertext: hex2bytes(testVector.ciphertext),
    tag: hex2bytes(testVector.tag)
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
    assertEquals(actual.ciphertext, ciphertext);
    assertEquals(actual.tag, tag);
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
    assertEquals(
      aeadChaCha20Poly1305Open(key, nonce, ciphertext, aad, tag),
      plaintext
    );
  }
});

test(function aeadChaCha20Poly1305OpenNullIfNotAuthenticated(): void {
  const receivedTag: Uint8Array = new Uint8Array(16);
  for (const { key, nonce, aad, ciphertext } of testVectors) {
    assertEquals(
      aeadChaCha20Poly1305Open(key, nonce, ciphertext, aad, receivedTag),
      null
    );
  }
});

runIfMain(import.meta, { parallel: true });
