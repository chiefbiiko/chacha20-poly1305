import { test, assert, runIfMain } from "https://deno.land/std/testing/mod.ts";
import { constantTimeEqual } from "./constant_time_equal.ts";

test(function constantTimeEqualTruePositive(): void {
  const a: Uint8Array = new Uint8Array([1,2,3]);
  const b: Uint8Array = new Uint8Array([1,2,3]);
  assert(constantTimeEqual(a, b));
});

test(function constantTimeEqualTrueNegative(): void {
  const a: Uint8Array = new Uint8Array([1,2,3]);
  const b: Uint8Array = new Uint8Array([3,2,1]);
  assert(!constantTimeEqual(a, b));
});

test(function constantTimeEqualThrows(): void {
  const a: Uint8Array = new Uint8Array([1,2,3]);
  const b: Uint8Array = new Uint8Array([3,2]);
  assert.throws(constantTimeEqual.bind(null, a, b), TypeError);
});

test(function constantTimeEqualTimings() {
  const n: number = 1000;
  const timings: number[] = Array(n);
  const a: Uint8Array = new Uint8Array(16);
  const b: Uint8Array = new Uint8Array(16).fill(99);
  let start: number;
  for (let i: number = n; i; --i) {
    if (i % 2) {
      b.fill(77);
    }
    start = Date.now();
    constantTimeEqual(a, b);
    timings.push(Date.now() - start);
  }
  // TODO: assert that std dev is lt 1ms
});

runIfMain(import.meta);
