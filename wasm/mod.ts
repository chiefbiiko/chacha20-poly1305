import { loadWasm } from "./loadWasm.ts";

const wasm = loadWasm();

console.log("wasm", wasm, "seal arity", wasm.seal.length); //, "free arity", wasm.__wbindgen_free.length);

/** Applies AEAD_CHACHA20_POLY1305 to seal given plaintext. */
export function seal(
  key: Uint8Array,
  nonce: Uint8Array,
  plaintext: Uint8Array,
  aad: Uint8Array
): { ciphertext: Uint8Array; tag: Uint8Array } {
  const keyPtr: number = wasm.__wbindgen_malloc(key.byteLength);
  const noncePtr: number = wasm.__wbindgen_malloc(nonce.byteLength);
  const plaintextPtr: number = wasm.__wbindgen_malloc(plaintext.byteLength);
  const aadPtr: number = wasm.__wbindgen_malloc(aad.byteLength);
  const ciphertextPtr: number = wasm.__wbindgen_malloc(plaintext.byteLength);
  const tagPtr: number = wasm.__wbindgen_malloc(16);

  const mem: Uint8Array = new Uint8Array(wasm.memory.buffer);

  mem.set(key, keyPtr);
  mem.set(nonce, noncePtr);
  mem.set(plaintext, plaintextPtr);
  mem.set(aad, aadPtr);

  wasm.seal(
    keyPtr,
    key.byteLength,
    noncePtr,
    nonce.byteLength,
    aadPtr,
    aad.byteLength,
    plaintextPtr,
    plaintext.byteLength,
    ciphertextPtr,
    plaintext.byteLength,
    tagPtr,
    16
  );

  const ciphertext: Uint8Array = new Uint8Array(plaintext.byteLength);
  const tag: Uint8Array = new Uint8Array(16);

  ciphertext.set(
    mem.subarray(ciphertextPtr, ciphertextPtr + plaintext.byteLength)
  );
  tag.set(mem.subarray(tagPtr, tagPtr + 16));

  return { ciphertext, tag };
}
