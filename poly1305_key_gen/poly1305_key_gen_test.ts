import { test, runIfMain } from "https://deno.land/std/testing/mod.ts";
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import { encode } from "https://denopkg.com/chiefbiiko/std-encoding/mod.ts";
import { poly1305KeyGen } from "./poly1305_key_gen.ts";

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
  otk: Uint8Array;
}

function loadTestVectors(): TestVector[] {
  return JSON.parse(
    new TextDecoder().decode(
      readFileSync(`${DIRNAME}/poly1305_key_gen_test_vectors.json`)
    )
  ).map(
    (testVector: { [key: string]: string }): TestVector => ({
      key: encode(testVector.key, "hex"),
      nonce: encode(testVector.nonce, "hex"),
      otk: encode(testVector.otk, "hex")
    })
  );
}

const testVectors: TestVector[] = loadTestVectors();

test(function poly1305KeyGenBasic(): void {
  for (const { key, nonce, otk } of testVectors) {
    assertEquals(poly1305KeyGen(key, nonce), otk);
  }
});

runIfMain(import.meta);
