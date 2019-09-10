import { test, runIfMain } from "https://deno.land/std/testing/mod.ts";
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import { aeadXchaCha20Poly1305Seal } from "./aead_xchacha20_poly1305.ts";
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
      name: `aeadChaCha20Poly1305Seal [${i}]`,
      fn(): void {
        const actual: {
          ciphertext: Uint8Array;
          tag: Uint8Array;
          aad: Uint8Array;
        } = aeadXchaCha20Poly1305Seal(key, nonce, plaintext, new Uint8Array(0));

        assertEquals(actual.ciphertext, expected);
      }
    });
  }
);

runIfMain(import.meta, { parallel: true });
