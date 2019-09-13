import { test, runIfMain } from "https://deno.land/std/testing/mod.ts";
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import { encode } from "https://denopkg.com/chiefbiiko/std-encoding/mod.ts";
import {
  seal,
  open
} from "./mod.ts";

import "./chacha20_poly1305_construct/chacha20_poly1305_construct_test.ts";
import "./constant_time_equal/constant_time_equal_test.ts";
import "./poly1305_keygen/poly1305_keygen_test.ts";
import "./right_zero_pad16/right_zero_pad16_test.ts";

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
    new TextDecoder().decode(Deno.readFileSync("./test_vectors.json"))
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

// See https://tools.ietf.org/html/rfc8439
const testVectors: TestVector[] = loadTestVectors();

testVectors.forEach(
  (
    { key, nonce, plaintext, aad, ciphertext, tag }: TestVector,
    i: number
  ): void => {
    test({
      name: `seal [${i}]`,
      fn(): void {
        const actual: {
          ciphertext: Uint8Array;
          tag: Uint8Array;
          aad: Uint8Array;
        } = seal(key, nonce, plaintext, aad);

        assertEquals(actual.ciphertext, ciphertext);
        assertEquals(actual.tag, tag);
      }
    });
  }
);

testVectors.forEach(
  (
    { key, nonce, plaintext, aad, ciphertext, tag }: TestVector,
    i: number
  ): void => {
    test({
      name: `open [${i}]`,
      fn(): void {
        assertEquals(
          open(key, nonce, ciphertext, aad, tag),
          plaintext
        );
      }
    });
  }
);

testVectors.forEach(
  ({ key, nonce, aad, ciphertext }: TestVector, i: number): void => {
    test({
      name: `chacha20poly1305 nulls if not authenticated [${i}]`,
      fn(): void {
        assertEquals(
          open(key, nonce, ciphertext, aad, new Uint8Array(16)),
          null
        );
      }
    });
  }
);

testVectors.forEach(
  ({ key, nonce, plaintext, aad }: TestVector, i: number): void => {
    test({
      name: `seal nulls if the key length is invalid [${i}]`,
      fn(): void {
        assertEquals(
          seal(key.subarray(-9), nonce, plaintext, aad),
          null
        );
      }
    });
  }
);

testVectors.forEach(
  ({ key, nonce, plaintext, aad }: TestVector, i: number): void => {
    test({
      name: `seal nulls if the nonce length is invalid [${i}]`,
      fn(): void {
        assertEquals(
          seal(key, nonce.subarray(-9), plaintext, aad),
          null
        );
      }
    });
  }
);

testVectors.forEach(
  ({ key, nonce, ciphertext, aad, tag }: TestVector, i: number): void => {
    test({
      name: `open nulls if the key length is invalid [${i}]`,
      fn(): void {
        assertEquals(
          open(key.subarray(-9), nonce, ciphertext, aad, tag),
          null
        );
      }
    });
  }
);

testVectors.forEach(
  ({ key, nonce, ciphertext, aad, tag }: TestVector, i: number): void => {
    test({
      name: `open nulls if the nonce length is invalid [${i}]`,
      fn(): void {
        assertEquals(
          open(key, nonce.subarray(-9), ciphertext, aad, tag),
          null
        );
      }
    });
  }
);

runIfMain(import.meta, { parallel: true });
