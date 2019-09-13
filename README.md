# chacha20-poly1305

chacha20-poly1305 as defined by [RFC 8439](https://tools.ietf.org/html/rfc8439).

[![Travis](http://img.shields.io/travis/chiefbiiko/chacha20-poly1305.svg?style=flat)](http://travis-ci.org/chiefbiiko/chacha20-poly1305) [![AppVeyor](https://ci.appveyor.com/api/projects/status/github/chiefbiiko/chacha20-poly1305?branch=master&svg=true)](https://ci.appveyor.com/project/chiefbiiko/chacha20-poly1305)

## API

``` ts
export const KEY_BYTES: number = 32;
export const NONCE_BYTES: number = 12;
export const PLAINTEXT_BYTES_MAX: bigint = 274877906880n;
export const CIPHERTEXT_BYTES_MAX: bigint = 274877906896n;
export const AAD_BYTES_MAX: bigint = 18446744073709551615n;
export const TAG_BYTES: number = 16;

export function chacha20poly1305Seal(
  key: Uint8Array,
  nonce: Uint8Array,
  plaintext: Uint8Array,
  aad: Uint8Array
): { ciphertext: Uint8Array; tag: Uint8Array; aad: Uint8Array };

export function chacha20poly1305Open(
  key: Uint8Array,
  nonce: Uint8Array,
  ciphertext: Uint8Array,
  aad: Uint8Array,
  receivedTag: Uint8Array
): Uint8Array
```

## License

[MIT](./LICENSE)