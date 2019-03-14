import { test, assert, runIfMain } from "https://deno.land/std/testing/mod.ts";
import { chaCha20QuarterRound } from "./chacha20_quarter_round.ts";

const { readFileSync } = Deno;

interface TestVector {
  initialState: Uint32Array;
  quarterRoundParameters: number[];
  expectedState: Uint32Array;
}

function loadTestVectors(): TestVector[] {
  const testVectors = JSON.parse(
    new TextDecoder().decode(
      readFileSync("./chacha20_quarter_round_test_vectors.json")
    )
  );
  return testVectors.map((testVector: { [key: string]: any }): TestVector => ({
    initialState: Uint32Array.from(testVector.initialState),
    quarterRoundParameters: testVector.quarterRoundParameters,
    expectedState: Uint32Array.from(testVector.expectedState)
  }));
}

test(function chaCha20QuarterRounding(): void {
  for (const {
      initialState,
      quarterRoundParameters: [a, b, c, d],
      expectedState
    } of loadTestVectors()) {
    const state = Uint32Array.from(initialState);
    chaCha20QuarterRound(state, a, b, c, d);
    assert.equal(state, expectedState);
  }
});

runIfMain(import.meta);
