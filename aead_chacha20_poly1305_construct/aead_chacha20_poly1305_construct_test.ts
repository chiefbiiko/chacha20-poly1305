import { test, runIfMain } from "https://deno.land/std/testing/mod.ts";
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import { aeadChaCha20Poly1305Construct } from "./aead_chacha20_poly1305_construct.ts";
import { hex2bytes } from "./../util/util.ts";

const { readFileSync, platform: { os } } = Deno;

const DIRNAME = (os !== "win" ? "/" : "") +
  import.meta.url.replace(/^file:\/+|\/[^/]+$/g, "");

interface TestVector {
  ciphertext: Uint8Array;
  aad: Uint8Array;
  expected: Uint8Array
}

function loadTestVectors(): TestVector[] {
  const testVectors = JSON.parse(
    new TextDecoder().decode(readFileSync(`${DIRNAME}/aead_chacha20_poly1305_construct_test_vectors.json`))
  );
  return testVectors.map((testVector: { [key: string]: string }): TestVector => ({
    ciphertext: hex2bytes(testVector.ciphertext),
    aad: hex2bytes(testVector.aad),
    expected: hex2bytes(testVector.expected)
  }));
}

test(function aeadChaCha20Poly1305ConstructBasic(): void {
  for (const { ciphertext, aad, expected } of loadTestVectors()) {
    assertEquals(aeadChaCha20Poly1305Construct(ciphertext, aad), expected);
  }
});

runIfMain(import.meta);
