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

testVectors.forEach(
  (
    { key, nonce, plaintext, aad, ciphertext, tag }: TestVector,
    i: number
  ): void => {
    test({
      name: `aeadChaCha20Poly1305Seal [${i}]`,
      fn(): void {
        const actual: {
          ciphertext: Uint8Array;
          tag: Uint8Array;
        } = aeadChaCha20Poly1305Seal(key, nonce, plaintext, aad);

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
      name: `aeadChaCha20Poly1305Open [${i}]`,
      fn(): void {
        assertEquals(
          aeadChaCha20Poly1305Open(key, nonce, ciphertext, aad, tag),
          plaintext
        );
      }
    });
  }
);

testVectors.forEach(
  ({ key, nonce, aad, ciphertext }: TestVector, i: number): void => {
    test({
      name: `aeadChaCha20Poly1305 nulls if not authenticated [${i}]`,
      fn(): void {
        assertEquals(
          aeadChaCha20Poly1305Open(
            key,
            nonce,
            ciphertext,
            aad,
            new Uint8Array(16)
          ),
          null
        );
      }
    });
  }
);

testVectors.forEach(
  ({ key, nonce, ciphertext, aad, tag }: TestVector, i: number): void => {
    test({
      name: `aeadChaCha20Poly1305Open throws if the key length is invalid [${i}]`,
      fn(): void {
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
      }
    });
  }
);

testVectors.forEach(
  ({ key, nonce, ciphertext, aad, tag }: TestVector, i: number): void => {
    test({
      name: `aeadChaCha20Poly1305Open throws if the nonce length is invalid [${i}]`,
      fn(): void {
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
      }
    });
  }
);

testVectors.forEach(
  ({ key, nonce, plaintext, aad, tag }: TestVector, i: number): void => {
    test({
      name: `aeadChaCha20Poly1305Seal throws if the key length is invalid [${i}]`,
      fn(): void {
        assertThrows(
          aeadChaCha20Poly1305Seal.bind(
            null,
            key.subarray(-9),
            nonce,
            plaintext,
            aad,
            tag
          ),
          TypeError
        );
      }
    });
  }
);

testVectors.forEach(
  ({ key, nonce, plaintext, aad, tag }: TestVector, i: number): void => {
    test({
      name: `aeadChaCha20Poly1305Seal throws if the nonce length is invalid [${i}]`,
      fn(): void {
        assertThrows(
          aeadChaCha20Poly1305Seal.bind(
            null,
            key,
            nonce.subarray(-9),
            plaintext,
            aad,
            tag
          ),
          TypeError
        );
      }
    });
  }
);

runIfMain(import.meta, { parallel: true });
