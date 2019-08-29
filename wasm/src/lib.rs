use chacha20_poly1305_aead::{/*decrypt, */encrypt};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn seal(
    key: &[u8],
    nonce: &[u8],
    aad: &[u8],
    plaintext: &[u8],
    mut ciphertext: Vec<u8>,
    mut tag: Vec<u8>,
) -> () {
    tag.copy_from_slice(&encrypt(key, nonce, aad, plaintext, &mut ciphertext).unwrap());
}
