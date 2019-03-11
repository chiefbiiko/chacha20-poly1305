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
    b >>= BIGINT_EIGHT;
  }
}

export function numberToLittleEndianBytes(
  v: number,
  out: Uint8Array,
  n: number,
  o: number = 0
): void {
  const end: number = o + n;
  for (let i: number = o; i < end; ++i) {
    out[i] = v & 0xff;
    v >>= 8;
  }
}

export function swapBigInt(b: bigint): bigint {
  let hex: string = b.toString(16);
  if (hex.length % 2) {
    hex = `0${hex}`;
  }
  return BigInt(`0x${hex.match(/../g).reverse().join("")}`);
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

export function inspect(x: Uint8Array, msg: string = ""): void {
  const hex: string = x.reduce((acc: string, cur: number) => {
    let byte: string = cur.toString(16);
    if (byte.length === 1) {
      byte = `0${byte}`;
    }
    return `${acc}${byte}`;
  }, "");
  console.error("\n", msg, hex, "\n");
}