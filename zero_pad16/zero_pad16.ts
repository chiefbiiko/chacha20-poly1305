export function zeroPad16(x: Uint8Array): Uint8Array {
  const rmd: number = x.length % 16;
  if (!rmd) {
    return x;
  } else {
    const padLength: number = 16 - rmd;
    const out: Uint8Array = new Uint8Array(x.length + padLength);

    out.set(x, 0);
    out.fill(0, x.length, out.length);

    return out;
  }
}
