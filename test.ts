import { runIfMain } from "https://deno.land/std/testing/mod.ts";

import "./right_zero_pad16/right_zero_pad16_test.ts";
import "./poly1305_clamp/poly1305_clamp_test.ts";
import "./constant_time_equal/constant_time_equal_test.ts";
import "./chacha20_init_state/chacha20_init_state_test.ts";
import "./chacha20_quarter_round/chacha20_quarter_round_test.ts";
import "./chacha20_block/chacha20_block_test.ts";
import "./chacha20_cipher/chacha20_cipher_test.ts";
import "./poly1305_key_gen/poly1305_key_gen_test.ts";
import "./poly1305/poly1305_test.ts";
import "./poly1305_msg_block_to_big_int/poly1305_msg_block_to_big_int_test.ts";
import "./aead_chacha20_poly1305_construct/aead_chacha20_poly1305_construct_test.ts";
import "./aead_chacha20_poly1305_test.ts";

runIfMain(import.meta, { parallel: true });
