export function constantTimeEqual(a: Uint8Array, b: Uint8Array): boolean {
  let diff: number = a.byteLength === b.byteLength ? 0 : 1;

  for (let i: number = Math.max(a.byteLength, b.byteLength) - 1; i >= 0; --i) {
    diff |= a[i] ^ b[i];
  }

  return diff === 0;
}
