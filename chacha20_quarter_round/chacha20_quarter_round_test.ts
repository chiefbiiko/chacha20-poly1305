import { test, runIfMain } from "https://deno.land/std/testing/mod.ts";
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import { chaCha20QuarterRound } from "./chacha20_quarter_round.ts";

const {
  readFileSync,
  platform: { os }
} = Deno;

const DIRNAME =
  (os !== "win" ? "/" : "") +
  import.meta.url.replace(/^file:\/+|\/[^/]+$/g, "");

interface TestVector {
  initialState: Uint32Array;
  quarterRoundParameters: number[];
  expectedState: Uint32Array;
}

function loadTestVectors(): TestVector[] {
  return JSON.parse(
    new TextDecoder().decode(
      readFileSync(`${DIRNAME}/chacha20_quarter_round_test_vectors.json`)
    )
  ).map(
    (testVector: { [key: string]: any }): TestVector => ({
      initialState: Uint32Array.from(testVector.initialState),
      quarterRoundParameters: testVector.quarterRoundParameters,
      expectedState: Uint32Array.from(testVector.expectedState)
    })
  );
}

const testVectors: TestVector[] = loadTestVectors();

test(function chaCha20QuarterRoundBasic(): void {
  for (const {
    initialState,
    quarterRoundParameters: [a, b, c, d],
    expectedState
  } of testVectors) {
    const state = Uint32Array.from(initialState);

    chaCha20QuarterRound(state, a, b, c, d);

    assertEquals(state, expectedState);
  }
});

runIfMain(import.meta);
