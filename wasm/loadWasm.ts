import { toUint8Array } from "https://deno.land/x/base64/mod.ts";

// let wasm: { [key:string]: any};
// const { TextDecoder } = require(String.raw`util`);

// wasm = require('./wasm_bg');


export function loadWasm(): {addHeapObject: Function,wasm: { [key: string]: any }} {
  let wasm: {[key:string]:any};

  //////////////////////////////////////////////////////////////////////////////

  const heap: any[] = new Array(36).fill(undefined);

  heap[32] = undefined;
  heap[33] = null;
  heap[34] = true;
  heap[35] = false

  let heap_next: number = heap.length;

  function addHeapObject(obj: any): number {
      if (heap_next === heap.length) {
        heap.push(heap.length + 1);
      }

      const i: number = heap_next;

      heap_next = heap[i];

      heap[i] = obj;

      return i;
  }

  function getObject(i: number): any {
    return heap[i]; }

  function dropObject(i: number): void {
      if (i < 36) {
        return;
      }

      heap[i] = heap_next;

      heap_next = i;
  }

  function takeObject(i: number): any {
      const rtn: any = getObject(i);

      dropObject(i);

      return rtn;
  }

  // module.exports.seal = function(key, nonce, aad, plaintext, ciphertext, tag) {
  //     wasm.seal(addHeapObject(key), addHeapObject(nonce), addHeapObject(aad), addHeapObject(plaintext), addHeapObject(ciphertext), addHeapObject(tag));
  // };

  let mem: Uint8Array = null;
  let decoder: TextDecoder = new TextDecoder();

  function getUint8Memory(): Uint8Array {
      if (mem === null || mem.buffer !== wasm.memory.buffer) {
          mem = new Uint8Array(wasm.memory.buffer);
      }

      return mem;
  }

  function getStringFromWasm(ptr: number, len: number): string {
      return decoder.decode(getUint8Memory().subarray(ptr, ptr + len));
  }

  const imports: {wbg: {[key:string]: Function}} = {
    wbg: {
      __wbindgen_object_drop_ref(arg0: any){
          takeObject(arg0);
      },
      __wbg_buffer_d31feadf69cb45fc(arg0: number): number {
          const ret: ArrayBuffer = getObject(arg0).buffer;

          return addHeapObject(ret);
      },
      __wbg_newwithbyteoffsetandlength_bac57664fe087b80(arg0: number, arg1: number, arg2: number): number {
          const ret: Uint8Array = new Uint8Array(getObject(arg0), arg1 >>> 0, arg2 >>> 0);

          return addHeapObject(ret);
      },
      __wbg_length_b6e0c5630f641946(arg0: number): number {
          return getObject(arg0).length;
      },
      __wbg_new_ed7079cf157e44d5(arg0: number): number {
          return addHeapObject(new Uint8Array(getObject(arg0)));
      },
      __wbg_set_2aae8dbe165bf1a3(arg0: number, arg1:number, arg2: number): void {
          getObject(arg0).set(getObject(arg1), arg2 >>> 0);
      },
      __wbindgen_throw(arg0: number, arg1: number): void {
          throw new Error(getStringFromWasm(arg0, arg1));
      },
      __wbindgen_memory(): number {
          return addHeapObject(wasm.memory);
      }
    }
  }

  // module.exports.__wbindgen_object_drop_ref = function(arg0) {
  //     takeObject(arg0);
  // };

  // module.exports.__wbg_buffer_d31feadf69cb45fc = function(arg0) {
  //     const ret = getObject(arg0).buffer;
  //     return addHeapObject(ret);
  // };

  // module.exports.__wbg_newwithbyteoffsetandlength_bac57664fe087b80 = function(arg0, arg1, arg2) {
  //     const ret = new Uint8Array(getObject(arg0), arg1 >>> 0, arg2 >>> 0);
  //     return addHeapObject(ret);
  // };

  // module.exports.__wbg_length_b6e0c5630f641946 = function(arg0) {
  //     const ret = getObject(arg0).length;
  //     return ret;
  // };

  // module.exports.__wbg_new_ed7079cf157e44d5 = function(arg0) {
  //     const ret = new Uint8Array(getObject(arg0));
  //     return addHeapObject(ret);
  // };

  // module.exports.__wbg_set_2aae8dbe165bf1a3 = function(arg0, arg1, arg2) {
  //     getObject(arg0).set(getObject(arg1), arg2 >>> 0);
  // };

  // module.exports.__wbindgen_throw = function(arg0, arg1) {
  //     throw new Error(getStringFromWasm(arg0, arg1));
  // };

  // module.exports.__wbindgen_memory = function() {
  //     const ret = wasm.memory;
  //     return addHeapObject(ret);
  // };

  //////////////////////////////////////////////////////////////////////////////

  wasm =  new WebAssembly.Instance(
    new WebAssembly.Module(
      toUint8Array(
""
        )
    ),
    imports
  ).exports;

return {addHeapObject, wasm};
}
