import { test, assert, runIfMain } from "https://deno.land/std/testing/mod.ts";
import { poly1305 } from "./poly1305.ts";
import { hex2bin } from "./../util/util.ts";

const { readFileSync } = Deno;

interface TestVector {
  otk: Uint8Array;
  msg: Uint8Array;
  tag: Uint8Array;
}

export function loadTestVectors(): TestVector[] {
  const testVectors = JSON.parse(
    new TextDecoder().decode(readFileSync("./poly1305_test_vectors.json"))
  );
  return testVectors.map((testVector: { [key: string]: string }): TestVector => ({
    otk: hex2bin(testVector.otk),
    msg: hex2bin(testVector.msg),
    tag: hex2bin(testVector.tag)
  }));
}

const testVectors: TestVector[] = loadTestVectors();
const edgeCases: TestVector[] = testVectors.splice(-2);


test(function poly1305Macing(): void {
  for (const { otk, msg, tag } of testVectors) {
    assert.equal(poly1305(otk, msg), tag);  
  }
});

// test(function poly1305MacingEdgeCases(): void {
//   for (const { otk, msg, tag } of edgeCases) {
//     assert.equal(poly1305(otk, msg), tag);  
//   }
// });

runIfMain(import.meta);
