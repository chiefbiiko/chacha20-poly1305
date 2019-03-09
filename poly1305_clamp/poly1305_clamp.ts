export function poly1305Clamp(r: Uint8Array): void {
  if (r.length !== 16) {
    throw new TypeError("r must have 16 bytes");
  }
  r[3] &= 15;
  r[7] &= 15;
  r[11] &= 15;
  r[15] &= 15;
  r[4] &= 252;
  r[8] &= 252;
  r[12] &= 252;
}
