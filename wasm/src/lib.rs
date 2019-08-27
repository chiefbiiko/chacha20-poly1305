use chacha20_poly1305_aead::{decrypt, encrypt};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn seal(
    key: Vec<u8>,
    nonce: Vec<u8>,
    aad: Vec<u8>,
    plaintext: Vec<u8>,
    mut ciphertext: Vec<u8>,
) -> Result<Vec<u8>, JsValue> {
    Ok(encrypt(&key, &nonce, &aad, &plaintext, &mut ciphertext).unwrap().to_vec())
}

#[wasm_bindgen]
pub fn open(
    key: Vec<u8>,
    nonce: Vec<u8>,
    aad: Vec<u8>,
    ciphertext: Vec<u8>,
    tag: Vec<u8>,
    mut plaintext: Vec<u8>,
) -> Result<(), JsValue> {
    Ok(decrypt(&key, &nonce, &aad, &ciphertext, &tag, &mut plaintext).unwrap())
}
