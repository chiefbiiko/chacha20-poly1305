export function constantTimeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) {
    throw new TypeError("a and b must have the same length");
  }
  let diff: number = 0;
  for (let i: number = a.length - 1; i >= 0; --i) {
    diff |= a[i] ^ b[i];
  }
  return diff === 0;
}
