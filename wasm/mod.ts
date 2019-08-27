import { loadWasm } from "./loadWasm.ts";

const wasm: { [key: string]: any } = loadWasm();

console.log(wasm);