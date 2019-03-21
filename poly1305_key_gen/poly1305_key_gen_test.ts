import { test, runIfMain } from "https://deno.land/std/testing/mod.ts";
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import { poly1305KeyGen } from "./poly1305_key_gen.ts";
import { hex2bin } from "./../util/util.ts";

const { readFileSync, platform: { os } } = Deno;

const DIRNAME = (os !== "win" ? "/" : "") +
  import.meta.url.replace(/^file:\/+|\/[^/]+$/g, "");

interface TestVector {
  key: Uint8Array;
  nonce: Uint8Array;
  otk: Uint8Array;
}

function loadTestVectors(): TestVector[] {
  const testVectors = JSON.parse(
    new TextDecoder().decode(
      readFileSync(`${DIRNAME}/poly1305_key_gen_test_vectors.json`)
    )
  );
  return testVectors.map((testVector: { [key: string]: string }): TestVector => ({
    key: hex2bin(testVector.key),
    nonce: hex2bin(testVector.nonce),
    otk: hex2bin(testVector.otk)
  }));
}

test(function poly1305KeyGenBasic(): void {
  for (const { key, nonce, otk } of loadTestVectors()) {
    assertEquals(poly1305KeyGen(key, nonce), otk);
  }
});

runIfMain(import.meta);
