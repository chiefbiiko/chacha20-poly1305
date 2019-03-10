export function rotateLeft(v: number, c: number): number {
  return (v << c) | (v >>> (32 - c));
}

export function fourLittleEndianBytesToNumber(
  x: Uint8Array,
  o: number
): number {
  return x[o] | (x[o + 1] << 8) | (x[o + 2] << 16) | (x[o + 3] << 24);
}

export function numberToFourLittleEndianBytes(
  x: Uint8Array,
  o: number,
  u: number
): void {
  x[o] = u & 0xff;
  u >>>= 8;
  x[o + 1] = u & 0xff;
  u >>>= 8;
  x[o + 2] = u & 0xff;
  u >>>= 8;
  x[o + 3] = u & 0xff;
}

export function littleEndianBytesToBigInt(x: Uint8Array): bigint {
  let b: bigint = 0n;
  for (let i: number = 0; i < x.length; ++i) {
    b += BigInt(x[i]) << BigInt(i * 8);
  }
  return b;
}

export function bigIntToNumber(b: bigint): number {
  return parseInt(String(b));
}

const BIGINT_BYTE_MASK: bigint = BigInt(0xff);
const BIGINT_EIGHT: bigint = BigInt(8);

export function bigIntToLittleEndianBytes(
  b: bigint,
  out: Uint8Array,
  n: number
): void {
  for (let i: number = 0; i < n; ++i) {
    out[i] = bigIntToNumber(b & BIGINT_BYTE_MASK);
    b = b >> BIGINT_EIGHT;
  }
}

export function swapBigInt(b: bigint): bigint {
  return BigInt(
    `0x${b
      .toString(16)
      .match(/../g)
      .reverse()
      .join("")}`
  );
}

export function hex2bin(hex: string): Uint8Array {
  const len: number = hex.length;
  if (len % 2) {
    throw new TypeError("Invalid hex string");
  }
  const buf: Uint8Array = new Uint8Array(Math.floor(len / 2));
  const end: number = len / 2;
  for (let i: number = 0; i < end; ++i) {
    const parsed = parseInt(hex.substr(i * 2, 2), 16);
    if (Number.isNaN(parsed)) {
      throw new TypeError("Invalid byte");
    }
    buf[i] = parsed;
  }
  return buf;
}
