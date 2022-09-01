use std::fs;

use openssl::{base64, rsa::Padding, symm::Cipher};

use crate::error::rsa::RsaError;

pub fn gen_keys(save_dir: &str, password: &str) -> Result<(), RsaError> {
    if password.len() < 1 {
        return Err(RsaError::PasswordIsEmpty);
    }

    let ras = openssl::rsa::Rsa::generate(2048).unwrap();
    let pem = ras.private_key_to_pem_passphrase(Cipher::aes_128_cbc(), password.as_bytes())?;

    let pub_key = ras.public_key_to_pem()?;

    let pub_key_fname = format!("{}/public.pem", save_dir);
    let priv_key_fname = format!("{}/private.pem", save_dir);

    fs::write(pub_key_fname.clone(), pub_key)?;
    fs::write(priv_key_fname.clone(), pem)?;

    println!("Keys saved to {} and {}", pub_key_fname, priv_key_fname);
    Ok(())
}

pub fn encrypt(pub_key_fname: &str, message: &str) -> Result<String, RsaError> {
    let pub_key_f = fs::read(pub_key_fname)?;

    let pub_key = openssl::rsa::Rsa::public_key_from_pem(&pub_key_f)?;
    let mut ciphertext = vec![0; pub_key.size() as usize];
    pub_key.public_encrypt(message.as_bytes(), &mut ciphertext, Padding::PKCS1)?;

    let ciphertext_base64 = base64::encode_block(&ciphertext);
    Ok(ciphertext_base64)
}

pub fn decrypt(pri_key_fname: &str, message: &str, password: &str) -> Result<String, RsaError> {
    let pri_key_f = fs::read(pri_key_fname)?;
    let pri_key =
        openssl::rsa::Rsa::private_key_from_pem_passphrase(&pri_key_f, password.as_bytes())?;

    let ciphertext = base64::decode_block(message)?;
    let mut plaintext: Vec<u8> = vec![0; pri_key.size() as usize];
    pri_key.private_decrypt(&ciphertext, &mut plaintext, Padding::PKCS1)?;

    let plaintext: Vec<u8> = plaintext
        .iter()
        .filter(|x| x.is_ascii() && *x != &b'\0')
        .map(|x| *x)
        .collect();

    match String::from_utf8(plaintext) {
        Ok(s) => Ok(s),
        Err(e) => Err(RsaError::PemError(e.to_string())),
    }
}

#[test]
fn test_encrypt_decrypt() {
    let pub_key_fname = "./public.pem";
    let message = "Hello, world!";
    let ciphertext_base64 = encrypt(pub_key_fname, message).unwrap();

    let pri_key_fname = "./private.pem";
    let password = "123456";
    let plaintext = decrypt(pri_key_fname, &ciphertext_base64, password).unwrap();
    assert_eq!(plaintext, message);
}
