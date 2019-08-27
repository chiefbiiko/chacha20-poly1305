export function xor(
  a: Uint8Array,
  b: Uint8Array,
  l: number,
  c: Uint8Array,
  o: number
): void {
  for (let i: number = 0; i < l; ++i) {
    c[o + i] = a[i] ^ b[i];
  }
}

export function rotateLeft(v: number, c: number): number {
  return (v << c) | (v >>> (32 - c));
}

export function fourLittleEndianBytesToNumber(
  x: Uint8Array,
  o: number
): number {
  return x[o] | (x[o + 1] << 8) | (x[o + 2] << 16) | (x[o + 3] << 24);
}

export function littleEndianBytesToBigInt(x: Uint8Array): bigint {
  let b: bigint = 0n;
  for (let i: number = 0; i < x.length; ++i) {
    b += BigInt(x[i]) << BigInt(i * 8);
  }
  return b;
}

const BIGINT_BYTE_MASK: bigint = BigInt(0xff);
const BIGINT_EIGHT: bigint = BigInt(8);

export function BigIntToSixteenLittleEndianBytes(
  b: bigint,
  out: Uint8Array
): void {
  for (let i: number = 0; i < 16; ++i) {
    out[i] = Number(b & BIGINT_BYTE_MASK);
    b >>= BIGINT_EIGHT;
  }
}

export function numberToLittleEndianBytes(
  v: number,
  out: Uint8Array,
  l: number,
  o: number
): void {
  const end: number = o + l;
  for (let i: number = o; i < end; ++i) {
    out[i] = v & 0xff;
    v >>= 8;
  }
}
