import { test, assert, runIfMain } from "https://deno.land/std/testing/mod.ts";
import { aeadChaCha20Poly1305Seal } from "./aead_chacha20_poly1305.ts";
import { hex2bin } from "./util/util.ts";

const { readFileSync } = Deno;

export function loadTestVector(): {
  key: Uint8Array;
  iv: Uint8Array;
  constant: Uint8Array;
  plaintext: Uint8Array;
  aad: Uint8Array;
  ciphertext: Uint8Array;
  tag: Uint8Array;
} {
  const testVector = JSON.parse(
    new TextDecoder().decode(
      readFileSync("./aead_chacha20_poly1305_test_vector.json")
    )
  );
  return {
    key: hex2bin(testVector.key),
    iv: hex2bin(testVector.iv),
    constant: hex2bin(testVector.constant),
    plaintext: hex2bin(testVector.plaintext),
    aad: hex2bin(testVector.aad),
    ciphertext: hex2bin(testVector.ciphertext),
    tag: hex2bin(testVector.tag)
  };
}

test(function aeadChaCha20Poly1305Sealing(): void {
  const {
    key,
    iv,
    constant,
    plaintext,
    aad,
    ciphertext,
    tag
  } = loadTestVector();
  const actual: {
    ciphertext: Uint8Array;
    tag: Uint8Array;
  } = aeadChaCha20Poly1305Seal(key, iv, constant, plaintext, aad);
  assert.equal(actual.ciphertext, ciphertext);
  assert.equal(actual.tag, tag);
});

runIfMain(import.meta);
