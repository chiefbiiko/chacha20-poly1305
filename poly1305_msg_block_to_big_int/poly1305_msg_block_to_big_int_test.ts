import { test, runIfMain } from "https://deno.land/std/testing/mod.ts";
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import { encode } from "https://denopkg.com/chiefbiiko/std-encoding/mod.ts";
import { poly1305MsgBlockToBigInt } from "./poly1305_msg_block_to_big_int.ts";

const {
  readFileSync,
  platform: { os }
} = Deno;

const DIRNAME =
  (os !== "win" ? "/" : "") +
  import.meta.url.replace(/^file:\/+|\/[^/]+$/g, "");

interface TestVector {
  msg: Uint8Array;
  expected: bigint[];
}

function loadTestVectors(): TestVector[] {
  return JSON.parse(
    new TextDecoder().decode(
      readFileSync(`${DIRNAME}/poly1305_msg_block_to_big_int_test_vectors.json`)
    )
  ).map(
    (testVector: { msg: string; expected: string[] }): TestVector => ({
      msg: encode(testVector.msg, "hex"),
      expected: testVector.expected.map(BigInt)
    })
  );
}

loadTestVectors().forEach(
  ({ msg, expected }: TestVector, i: number): void => {
    test({
      name: `poly1305MsgBlockToBigInt [${i}]`,
      fn(): void {
        const loopEnd: number = Math.ceil(msg.length / 16);

        for (let i: number = 1; i <= loopEnd; ++i) {
          assertEquals(poly1305MsgBlockToBigInt(msg, i * 16), expected.shift());
        }
      }
    });
  }
);

runIfMain(import.meta);
