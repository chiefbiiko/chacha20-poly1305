import { test, runIfMain } from "https://deno.land/std/testing/mod.ts";
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import { encode } from "https://denopkg.com/chiefbiiko/std-encoding/mod.ts";
import { chacha20Poly1305Construct } from "./chacha20_poly1305_construct.ts";

const {
  readFileSync,
  platform: { os }
} = Deno;

const DIRNAME =
  (os !== "win" ? "/" : "") +
  import.meta.url.replace(/^file:\/+|\/[^/]+$/g, "");

interface TestVector {
  ciphertext: Uint8Array;
  aad: Uint8Array;
  expected: Uint8Array;
}

function loadTestVectors(): TestVector[] {
  return JSON.parse(
    new TextDecoder().decode(
      readFileSync(
        `${DIRNAME}/chacha20_poly1305_construct_test_vectors.json`
      )
    )
  ).map(
    (testVector: { [key: string]: string }): TestVector => ({
      ciphertext: encode(testVector.ciphertext, "hex"),
      aad: encode(testVector.aad, "hex"),
      expected: encode(testVector.expected, "hex")
    })
  );
}

loadTestVectors().forEach(
  ({ ciphertext, aad, expected }: TestVector, i: number): void => {
    test({
      name: `chacha20Poly1305Construct [${i}]`,
      fn(): void {
        assertEquals(chacha20Poly1305Construct(ciphertext, aad), expected);
      }
    });
  }
);

runIfMain(import.meta);
