import { test, runIfMain } from "https://deno.land/std/testing/mod.ts";
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import { encode } from "https://denopkg.com/chiefbiiko/std-encoding/mod.ts";
import { poly1305 } from "./poly1305.ts";

const {
  readFileSync,
  platform: { os }
} = Deno;

const DIRNAME =
  (os !== "win" ? "/" : "") +
  import.meta.url.replace(/^file:\/+|\/[^/]+$/g, "");

interface TestVector {
  otk: Uint8Array;
  msg: Uint8Array;
  tag: Uint8Array;
}

function loadTestVectors(): TestVector[] {
  return JSON.parse(
    new TextDecoder().decode(
      readFileSync(`${DIRNAME}/poly1305_test_vectors.json`)
    )
  ).map(
    (testVector: { [key: string]: string }): TestVector => ({
      otk: encode(testVector.otk, "hex"),
      msg: encode(testVector.msg, "hex"),
      tag: encode(testVector.tag, "hex")
    })
  );
}

const testVectors: TestVector[] = loadTestVectors();

testVectors.forEach(
  ({ otk, msg, tag }: TestVector, i: number): void => {
    test({
      name: `poly1305 [${i}]`,
      fn(): void {
        assertEquals(poly1305(otk, msg), tag);
      }
    });
  }
);

runIfMain(import.meta, { parallel: true });
