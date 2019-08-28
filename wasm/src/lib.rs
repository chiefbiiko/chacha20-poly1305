use chacha20_poly1305_aead::{/*decrypt, */encrypt};
use wasm_bindgen::{JsValue, prelude::*};
use js_sys::Uint8Array;

// TRY: pass key, nonce.aad,plaintext as &[u8] -> no need to do the copy_to
#[wasm_bindgen]
pub fn seal(
    key: Uint8Array,
    nonce: Uint8Array,
    aad: Uint8Array,
    plaintext: Uint8Array,
    ciphertext: Uint8Array,
    tag: Uint8Array,
) -> Result<(), JsValue> {
   let mut _key: Vec<u8> = vec![0; 16];
   let mut _nonce: Vec<u8> = vec![0; 12];
   let mut _aad: Vec<u8> = vec![0; aad.length() as usize];
   let mut _plaintext: Vec<u8> = vec![0; plaintext.length() as usize];
   let mut _ciphertext: Vec<u8> = vec![0; ciphertext.length() as usize];

   key.copy_to(&mut _key);
   nonce.copy_to(&mut _nonce);
   aad.copy_to(&mut _aad);
   plaintext.copy_to(&mut _plaintext);

    let _tag = encrypt(
        &_key,
        &_nonce,
         &_aad,
         &_plaintext,
         &mut _ciphertext
     ).unwrap();

    ciphertext.set(&Uint8Array::from(&_ciphertext[..]), 0);
    tag.set(&Uint8Array::from(&_tag[..]), 0);

    Ok(())
}

// #[wasm_bindgen]
// pub fn open(
//     key: JsValue,
//     nonce: JsValue,
//     aad: JsValue,
//     ciphertext: JsValue,
//     tag: JsValue,
//     mut plaintext: JsValue,
// ) -> Result<(), JsValue> {
//     Ok(decrypt(&key, &nonce, &aad, &ciphertext, &tag, &mut plaintext).unwrap())
// }
