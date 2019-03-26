import { test, runIfMain } from "https://deno.land/std/testing/mod.ts";
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import { poly1305MsgBlockToBigInt } from "./poly1305_msg_block_to_big_int.ts";
import { hex2bytes } from "./../util/util.ts";

const { readFileSync, platform: { os } } = Deno;

const DIRNAME = (os !== "win" ? "/" : "") +
  import.meta.url.replace(/^file:\/+|\/[^/]+$/g, "");

interface TestVector {
  msg: Uint8Array;
  expected: bigint[]
}

function loadTestVectors(): TestVector[] {
  const testVectors = JSON.parse(
    new TextDecoder().decode(readFileSync(`${DIRNAME}/poly1305_msg_block_to_big_int_test_vectors.json`))
  );
  return testVectors.map((testVector: { msg: string, expected: string[] }): TestVector => ({
    msg: hex2bytes(testVector.msg),
    expected: testVector.expected.map(BigInt)
  }));
}

test(function poly1305MsgBlockToBigIntBasic(): void {
  let b: bigint;
  for (const { msg, expected } of loadTestVectors()) {
    const loopEnd: number = Math.ceil(msg.length / 16);
    for (let i: number = 1; i <= loopEnd; ++i) {
      b = poly1305MsgBlockToBigInt(msg, i * 16);
      assertEquals(b, expected.shift())
    }
  }
});

runIfMain(import.meta);
