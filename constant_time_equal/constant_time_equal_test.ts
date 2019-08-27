import { test, runIfMain } from "https://deno.land/std/testing/mod.ts";
import { assert } from "https://deno.land/std/testing/asserts.ts";
import { constantTimeEqual } from "./constant_time_equal.ts";

function average(arr: number[]): number {
  return (
    arr.reduce((acc: number, cur: number): number => acc + cur, 0) / arr.length
  );
}

function standardDeviation(arr: number[]): number {
  const avg: number = average(arr);
  const sqrDiff: number[] = arr.map((v: number): number => (v - avg) ** 2);
  const avgSqrDiff: number = average(sqrDiff);

  return Math.sqrt(avgSqrDiff);
}

test({
  name: "constantTimeEqual true positive",
  fn(): void {
    const a: Uint8Array = new Uint8Array([1, 2, 3]);
    const b: Uint8Array = new Uint8Array([1, 2, 3]);

    assert(constantTimeEqual(a, b));
  }
});

test({
  name: "constantTimeEqual true negative",
  fn(): void {
    const a: Uint8Array = new Uint8Array([1, 2, 3]);
    const b: Uint8Array = new Uint8Array([3, 2, 1]);

    assert(!constantTimeEqual(a, b));
  }
});

test({
  name: "constantTimeEqual iterates over max(a.length, b.length)",
  fn(): void {
    const a: Uint8Array = new Uint8Array([1, 2, 0]);
    const b: Uint8Array = new Uint8Array([1, 2]);

    assert(!constantTimeEqual(a, b));
  }
});

test({
  name: "constantTimeEqual - somewhat equal timings",
  fn(): void {
    const n: number = 1000;
    const timings: number[] = Array(n);
    const a: Uint8Array = new Uint8Array(16);
    const b: Uint8Array = new Uint8Array(16).fill(99);
    let start: number;

    for (let i: number = n; i; --i) {
      if (i % 2) {
        b.fill(0);
      } else {
        b.fill(99);
      }

      start = performance.now();

      constantTimeEqual(a, b);

      timings.push(performance.now() - start);
    }

    const stdDev: number = standardDeviation(timings);

    assert(stdDev < 0.3); // lt 300 microseconds
  }
});

runIfMain(import.meta, { parallel: true });
