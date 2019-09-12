import { test, runIfMain } from "https://deno.land/std/testing/mod.ts";
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import { xchacha20 } from "./xchacha20.ts";
import { encode } from "https://denopkg.com/chiefbiiko/std-encoding/mod.ts";

const {
  readFileSync,
  platform: { os }
} = Deno;

const DIRNAME =
  (os !== "win" ? "/" : "") +
  import.meta.url.replace(/^file:\/+|\/[^/]+$/g, "");

interface TestVector {
  key: Uint8Array;
  nonce: Uint8Array;
  counter: number;
  plaintext: Uint8Array;
  ciphertext: Uint8Array;
}

function loadTestVectors(): TestVector[] {
  return JSON.parse(
    new TextDecoder().decode(
      readFileSync(`${DIRNAME}/xchacha20_test_vectors.json`)
    )
  ).map(
    (testVector: { [key: string]: any }): TestVector => ({
      key: encode(testVector.key, "hex"),
      nonce: encode(testVector.nonce, "hex"),
      counter: testVector.counter,
      plaintext: encode(testVector.plaintext, "hex"),
      ciphertext: encode(testVector.ciphertext, "hex")
    })
  );
}

// See https://tools.ietf.org/html/draft-irtf-cfrg-xchacha-01#appendix-A.3.2
const testVectors: TestVector[] = loadTestVectors();

testVectors.forEach(
  (
    { key, nonce, counter, plaintext, ciphertext }: TestVector,
    i: number
  ): void => {
    test({
      name: `xchacha20 encryption [${i}]`,
      fn(): void {
        const out: Uint8Array = new Uint8Array(plaintext.byteLength);
        
        xchacha20(out, key, nonce, counter, plaintext);

        assertEquals(out, ciphertext);
      }
    });
  }
);

testVectors.forEach(
  (
    { key, nonce, counter, plaintext, ciphertext }: TestVector,
    i: number
  ): void => {
    test({
      name: `xchacha20 decryption [${i}]`,
      fn(): void {
        const out: Uint8Array = new Uint8Array(ciphertext.byteLength);

        xchacha20(out, key, nonce, counter, ciphertext);

        assertEquals(out, plaintext);
      }
    });
  }
);

runIfMain(import.meta, { parallel: true });
