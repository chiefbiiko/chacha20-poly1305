import { test, runIfMain } from "https://deno.land/std/testing/mod.ts";
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import { xChaCha20Cipher } from "./xchacha20_cipher.ts";
import { encode } from "https://denopkg.com/chiefbiiko/std-encoding/mod.ts";

const { readFileSync } = Deno;

interface TestVector {
  key: Uint8Array;
  nonce: Uint8Array;
  plaintext: Uint8Array;
  expected: Uint8Array;
}

function loadTestVectors(): TestVector[] {
  return JSON.parse(
    new TextDecoder().decode(
      readFileSync("./aead_xchacha20_poly1305_test_vectors.json")
    )
  ).map(
    (testVector: { [key: string]: string }): TestVector => ({
      key: encode(testVector.key, "hex"),
      nonce: encode(testVector.nonce, "hex"),
      plaintext: testVector.plaintext ? encode(testVector.plaintext, "hex") : new Uint8Array(0),
      expected: encode(testVector.expected, "hex")
    })
  );
}

// See https://github.com/jedisct1/libsodium/blob/master/test/default/xchacha20.c
const testVectors: TestVector[] = loadTestVectors();

testVectors.slice(0, 1).forEach(
  (
    { key, nonce, plaintext, expected }: TestVector,
    i: number
  ): void => {
    test({
      name: `xChaCha20Cipher [${i}]`,
      fn(): void {
        const actual: {
          ciphertext: Uint8Array;
          tag: Uint8Array;
          aad: Uint8Array;
        } = xChaCha20Cipher(key, nonce, plaintext, new Uint8Array(0));

        assertEquals(actual.ciphertext, expected);
      }
    });
  }
);

runIfMain(import.meta, { parallel: true });
