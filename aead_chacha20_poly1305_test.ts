import { test, runIfMain } from "https://deno.land/std/testing/mod.ts";
import {
  assertEquals,
  assertThrows
} from "https://deno.land/std/testing/asserts.ts";
import {
  aeadChaCha20Poly1305Seal,
  aeadChaCha20Poly1305Open
} from "./aead_chacha20_poly1305.ts";
import { encode } from "https://denopkg.com/chiefbiiko/std-encoding/mod.ts";

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
  return JSON.parse(
    new TextDecoder().decode(
      readFileSync("./aead_chacha20_poly1305_test_vectors.json")
    )
  ).map(
    (testVector: { [key: string]: string }): TestVector => ({
      key: encode(testVector.key, "hex"),
      nonce: encode(testVector.nonce, "hex"),
      plaintext: encode(testVector.plaintext, "hex"),
      aad: encode(testVector.aad, "hex"),
      ciphertext: encode(testVector.ciphertext, "hex"),
      tag: encode(testVector.tag, "hex")
    })
  );
}

const testVectors: TestVector[] = loadTestVectors();

test(function aeadChaCha20Poly1305SealBasic(): void {
  for (const { key, nonce, plaintext, aad, ciphertext, tag } of testVectors) {
    const actual: {
      ciphertext: Uint8Array;
      tag: Uint8Array;
    } = aeadChaCha20Poly1305Seal(key, nonce, plaintext, aad);

    assertEquals(actual.ciphertext, ciphertext);
    assertEquals(actual.tag, tag);
  }
});

test(function aeadChaCha20Poly1305OpenBasic(): void {
  for (const { key, nonce, plaintext, aad, ciphertext, tag } of testVectors) {
    assertEquals(
      aeadChaCha20Poly1305Open(key, nonce, ciphertext, aad, tag),
      plaintext
    );
  }
});

test(function aeadChaCha20Poly1305OpenNullsIfNotAuthenticated(): void {
  const receivedTag: Uint8Array = new Uint8Array(16);
  for (const { key, nonce, aad, ciphertext } of testVectors) {
    assertEquals(
      aeadChaCha20Poly1305Open(key, nonce, ciphertext, aad, receivedTag),
      null
    );
  }
});

test(function aeadChaCha20Poly1305OpenThrowsIfIncorrectKeyBytes(): void {
  const { key, nonce, ciphertext, aad, tag } = testVectors[0];
  assertThrows(
    aeadChaCha20Poly1305Open.bind(
      null,
      key.subarray(-9),
      nonce,
      ciphertext,
      aad,
      tag
    ),
    TypeError
  );
});

test(function aeadChaCha20Poly1305OpenThrowsIfIncorrectNonceBytes(): void {
  const { key, nonce, ciphertext, aad, tag } = testVectors[0];
  assertThrows(
    aeadChaCha20Poly1305Open.bind(
      null,
      key,
      nonce.subarray(-9),
      ciphertext,
      aad,
      tag
    ),
    TypeError
  );
});

test(function aeadChaCha20Poly1305SealThrowsIfIncorrectKeyBytes(): void {
  const { key, nonce, ciphertext, aad, tag } = testVectors[0];
  assertThrows(
    aeadChaCha20Poly1305Seal.bind(
      null,
      key.subarray(-9),
      nonce,
      ciphertext,
      aad,
      tag
    ),
    TypeError
  );
});

test(function aeadChaCha20Poly1305SealThrowsIfIncorrectNonceBytes(): void {
  const { key, nonce, ciphertext, aad, tag } = testVectors[0];
  assertThrows(
    aeadChaCha20Poly1305Seal.bind(
      null,
      key,
      nonce.subarray(-9),
      ciphertext,
      aad,
      tag
    ),
    TypeError
  );
});

runIfMain(import.meta, { parallel: true });
