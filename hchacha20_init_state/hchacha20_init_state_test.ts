import { test, runIfMain } from "https://deno.land/std/testing/mod.ts";
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import { encode } from "https://denopkg.com/chiefbiiko/std-encoding/mod.ts";
import { hChaCha20InitState } from "./hchacha20_init_state.ts";

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
  expected: Uint32Array;
}

function loadTestVectors(): TestVector[] {
  return JSON.parse(
    new TextDecoder().decode(
      readFileSync(`${DIRNAME}/hchacha20_init_state_test_vectors.json`)
    )
  ).map(
    (testVector: { [key: string]: any }): TestVector => ({
      key: encode(testVector.key, "hex"),
      nonce: encode(testVector.nonce, "hex"),
      expected: Uint32Array.from(testVector.expected)
    })
  );
}

// See https://tools.ietf.org/html/draft-irtf-cfrg-xchacha-01#section-2.2.1
const testVectors: TestVector[] = loadTestVectors();

testVectors.forEach(
  ({ key, nonce, expected }: TestVector, i: number): void => {
    test({
      name: `hChaCha20InitState [${i}]`,
      fn(): void {
        assertEquals(hChaCha20InitState(key, nonce), expected);
      }
    });
  }
);

runIfMain(import.meta, { parallel: true });
