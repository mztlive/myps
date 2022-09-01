use std::{collections::HashMap, sync::MutexGuard};

use serde::{Deserialize, Serialize};

/// 需要保存的账号密码
#[derive(Debug, Deserialize, Serialize)]
pub struct Record {
    pub url: String,

    pub account: String,

    pub title: String,

    pub password: String,

    pub remark: String,
}

impl Record {
    pub fn default(title: &str) -> Self {
        Record {
            url: String::new(),
            account: String::new(),
            title: title.to_string(),
            password: String::new(),
            remark: String::new(),
        }
    }
}

// 配置
pub struct Config {
    pub pem_path: String,

    pub db_dir: String,
}

// DB的数据类型
pub type MutexDB = MutexGuard<'static, HashMap<String, String>>;

// Rsa配置的数据类型
pub type MutexRsaConfig = MutexGuard<'static, Config>;

// 带锁的密码
pub type MutexPassword = MutexGuard<'static, String>;

// 全局锁
pub type MutexLock = MutexGuard<'static, bool>;
