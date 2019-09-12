import { test, runIfMain } from "https://deno.land/std/testing/mod.ts";
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import { encode } from "https://denopkg.com/chiefbiiko/std-encoding/mod.ts";
import { hchacha20, OUTPUT_BYTES } from "./hchacha20.ts";

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
  constant: Uint8Array;
  expected: Uint8Array;
}

function loadTestVectors(): TestVector[] {
  return JSON.parse(
    new TextDecoder().decode(
      readFileSync(`${DIRNAME}/hchacha20_test_vectors.json`)
    )
  ).map(
    (testVector: { [key: string]: any }): TestVector => ({
      key: encode(testVector.key, "hex"),
      nonce: encode(testVector.nonce, "hex"),
      constant: testVector.constant && encode(testVector.constant, "hex"),
      expected: encode(testVector.expected, "hex")
    })
  );
}

// See https://tools.ietf.org/html/draft-irtf-cfrg-xchacha-01#section-2.2.1
// and https://github.com/jedisct1/libsodium/blob/master/test/default/xchacha20.c
const testVectors: TestVector[] = loadTestVectors();

testVectors.forEach(
  ({ key, nonce, constant, expected }: TestVector, i: number): void => {
    test({
      name: `hchacha20 [${i}]`,
      fn(): void {
        const actual: Uint8Array = new Uint8Array(OUTPUT_BYTES);

        hchacha20(actual, key, nonce, constant);

        assertEquals(actual, expected);
      }
    });
  }
);

runIfMain(import.meta, { parallel: true });
