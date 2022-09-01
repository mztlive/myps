use std::{
    collections::HashMap,
    sync::{atomic::AtomicU32, Mutex},
};

use lazy_static::lazy_static;

use super::structs::Config;

lazy_static! {

    // 全局自增id
    pub static ref STATIC_ATOMIC_ID: AtomicU32 = AtomicU32::new(0);

    pub static ref STATIC_DB: Mutex<HashMap<String, String>> = {
        let map = HashMap::new();
        Mutex::new(map)
    };

    // 密码锁，如果这个锁 = true，则标示需要用户输入密码了
    pub static ref STATIC_PASSWORD_LOCK: Mutex<bool> = {
        let lock = true;
        Mutex::new(lock)
    };

    // 用户的密码，不会一直存在内存中
    pub static ref STATIC_PASSWORD: Mutex<String> = {
        let pass = String::new();
        Mutex::new(pass)
    };


    pub static ref STATIC_CFG: Mutex<Config> = {
        let cfg = Config{
            db_dir: "".to_string(),
            pem_path: "".to_string()
        };
        Mutex::new(cfg)
    };
}
