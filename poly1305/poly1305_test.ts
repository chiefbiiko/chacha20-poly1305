import { test, runIfMain } from "https://deno.land/std/testing/mod.ts";
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import { poly1305 } from "./poly1305.ts";
import { hex2bytes } from "./../util/util.ts";

const { readFileSync, platform: { os } } = Deno;

const DIRNAME = (os !== "win" ? "/" : "") +
  import.meta.url.replace(/^file:\/+|\/[^/]+$/g, "");

interface TestVector {
  otk: Uint8Array;
  msg: Uint8Array;
  tag: Uint8Array;
}

function loadTestVectors(): TestVector[] {
  return JSON.parse(
    new TextDecoder().decode(readFileSync(`${DIRNAME}/poly1305_test_vectors.json`))
  ).map((testVector: { [key: string]: string }): TestVector => ({
    otk: hex2bytes(testVector.otk),
    msg: hex2bytes(testVector.msg),
    tag: hex2bytes(testVector.tag)
  }));
}

const testVectors: TestVector[] = loadTestVectors();
const edgeCases: TestVector[] = testVectors.splice(-2);


test(function poly1305Basic(): void {
  for (const { otk, msg, tag } of testVectors) {
    assertEquals(poly1305(otk, msg), tag);
  }
});

// test(function poly1305EdgeCases(): void {
//   for (const { otk, msg, tag } of edgeCases) {
//     assertEquals(poly1305(otk, msg), tag);
//   }
// });

runIfMain(import.meta, { parallel: true });
