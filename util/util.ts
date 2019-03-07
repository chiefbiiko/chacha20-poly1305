export function rotateLeft(v: number, c: number): number {
  return (v << c) | (v >>> (32 - c));
}

export function fourLittleEndianBytesToNumber(x: Uint8Array, i: number): number {
  return x[i] | (x[i + 1] << 8) | (x[i + 2] << 16) | (x[i + 3] << 24);
}

export function numberToFourLittleEndianBytes(
  x: Uint8Array,
  i: number,
  u: number
): void {
  x[i] = u & 0xff;
  u >>>= 8;
  x[i + 1] = u & 0xff;
  u >>>= 8;
  x[i + 2] = u & 0xff;
  u >>>= 8;
  x[i + 3] = u & 0xff;
}

export function hex2bin(hex: string): Uint8Array {
  if (hex.indexOf("0x") === 0 || hex.indexOf("0X") === 0) {
    hex = hex.substr(2);
  }
  if (hex.length % 2) {
    hex += "0";
  }
  let bin: Uint8Array = new Uint8Array(hex.length >>> 1);
  for (let i: number = 0, len = hex.length >>> 1; i < len; i++) {
    bin[i] = parseInt(hex.substr(i << 1, 2), 16);
  }
  return bin;
}

export function inspectState(state: Uint32Array, msg: string = ""): void {
  let s: string = "";
  for (let i: number = 0; i < 16; ++i) {
    s += `${state[i].toString(16)} `;
  }
  console.log("\n", msg, s, "\n");
}
