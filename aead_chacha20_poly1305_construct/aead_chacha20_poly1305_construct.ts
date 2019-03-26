import { zeroPad16 } from "./../zero_pad16/zero_pad16.ts";
import { numberToLittleEndianBytes } from "./../util/util.ts";

export function aeadChaCha20Poly1305Construct(ciphertext: Uint8Array, aad: Uint8Array): Uint8Array {
  const paddedCiphertext: Uint8Array = zeroPad16(ciphertext);
  const paddedAad: Uint8Array = zeroPad16(aad);
  const paddedTotalLength: number = paddedCiphertext.length + paddedAad.length;
  const pac: Uint8Array = new Uint8Array(paddedTotalLength + 16);
  pac.set(paddedAad, 0);
  pac.set(paddedCiphertext, paddedAad.length);
  numberToLittleEndianBytes(aad.length, pac, 8, paddedTotalLength);
  numberToLittleEndianBytes(ciphertext.length, pac, 8, paddedTotalLength + 8);
  return pac;
}
