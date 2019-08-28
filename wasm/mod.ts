import { loadWasm } from "./loadWasm.ts";

const  { addHeapObject, wasm} = loadWasm();

console.log(wasm);

/** Applies AEAD_CHACHA20_POLY1305 to seal given plaintext. */
export function seal (key: Uint8Array, nonce: Uint8Array,  plaintext: Uint8Array,aad: Uint8Array): { ciphertext: Uint8Array; tag: Uint8Array } {
  const ciphertext: Uint8Array = new Uint8Array(plaintext.length);
  const tag: Uint8Array = new Uint8Array(16);

    wasm.seal(addHeapObject(key), addHeapObject(nonce), addHeapObject(aad), addHeapObject(plaintext), addHeapObject(ciphertext), addHeapObject(tag));

    return {ciphertext, tag}
};
