use crate::{error::business_error::BusinessError, rsa::gen::decrypt, rsa::gen::encrypt};

use super::{
    static_var::{STATIC_CFG, STATIC_DB, STATIC_PASSWORD, STATIC_PASSWORD_LOCK},
    structs::{MutexDB, MutexLock, MutexPassword, MutexRsaConfig, Record},
};

const PUB_KEY_FNAME: &str = "public.pem";

const PRIV_KEY_FNAME: &str = "private.pem";

struct RecordCommands {
    db: MutexDB,
    cfg: MutexRsaConfig,
    password: MutexPassword,
    is_lock: MutexLock,
}

impl RecordCommands {
    fn new(db: MutexDB, cfg: MutexRsaConfig, ps: MutexPassword, is_lock: MutexLock) -> Self {
        RecordCommands {
            db,
            cfg,
            password: ps,
            is_lock,
        }
    }

    /// 加密record
    fn record2str(&self, record: &Record) -> Result<String, BusinessError> {
        let ciphertext = format!(
            "{} {} {} {} {}\n",
            record.url, record.account, record.title, record.password, record.remark
        );

        println!("{}", ciphertext);
        let full_pub_key_fname = [&self.cfg.pem_path, "/", PUB_KEY_FNAME].concat();
        let ciphertext = encrypt(full_pub_key_fname.as_str(), &ciphertext)?;
        Ok(ciphertext)
    }

    /// 解密record
    fn str2record(&self, ciphertext: &str) -> Result<Record, BusinessError> {
        let full_priv_key_fname = [&self.cfg.pem_path, "/", PRIV_KEY_FNAME].concat();

        if self.password.is_empty() {
            return Err(BusinessError::NoSetPassword);
        }

        let plaintext = decrypt(full_priv_key_fname.as_str(), &ciphertext, &self.password)?;
        println!("{}", plaintext);
        let parts = plaintext.split(" ").collect::<Vec<&str>>();

        if parts.len() != 5 {
            return Err(BusinessError::RsaError("解密失败".to_string()));
        }

        println!("parts: {:?}", parts);

        let record = Record {
            title: parts[2].to_string(),
            account: parts[1].to_string(),
            password: parts[3].to_string(),
            remark: parts[4].to_string(),
            url: parts[0].to_string(),
        };

        Ok(record)
    }

    /// 插入一个新的记录，如果已经存在会覆盖
    pub fn add(&mut self, record: Record) -> Result<(), BusinessError> {
        let ciphertext = self.record2str(&record)?;
        self.db.insert(record.title.to_string(), ciphertext);
        Ok(())
    }

    /// 更新一个现有的记录（主要是title变化场景）
    pub fn update(&mut self, record: Record, old_title: &str) -> Result<(), BusinessError> {
        self.db.remove(old_title);
        let ciphertext = self.record2str(&record)?;
        self.db.insert(record.title.to_string(), ciphertext);
        Ok(())
    }

    /// 删除一个数据
    pub fn remove(&mut self, title: &str) {
        self.db.remove(title);
    }

    /// 查询一个记录
    pub fn get(&self, title: &str) -> Result<Record, BusinessError> {
        // 已经上锁，不允许查询
        if *self.is_lock {
            return Err(BusinessError::NoSetPassword);
        }

        if let Some(ciphertext) = self.db.get(title) {
            self.str2record(ciphertext)
        } else {
            Ok(Record::default(title))
        }
    }
}

#[tauri::command]
pub fn add(record: Record) -> Result<(), BusinessError> {
    let mut command = RecordCommands::new(
        STATIC_DB.lock()?,
        STATIC_CFG.lock()?,
        STATIC_PASSWORD.lock()?,
        STATIC_PASSWORD_LOCK.lock()?,
    );

    command.add(record)
}

#[tauri::command]
pub fn update(record: Record, old_title: &str) -> Result<(), BusinessError> {
    let mut command = RecordCommands::new(
        STATIC_DB.lock()?,
        STATIC_CFG.lock()?,
        STATIC_PASSWORD.lock()?,
        STATIC_PASSWORD_LOCK.lock()?,
    );

    command.update(record, old_title)
}

#[tauri::command]
pub fn get_details(title: &str) -> Result<Record, BusinessError> {
    let command = RecordCommands::new(
        STATIC_DB.lock()?,
        STATIC_CFG.lock()?,
        STATIC_PASSWORD.lock()?,
        STATIC_PASSWORD_LOCK.lock()?,
    );
    command.get(title)
}

#[tauri::command]
pub fn remove(title: &str) -> Result<(), BusinessError> {
    let mut command = RecordCommands::new(
        STATIC_DB.lock()?,
        STATIC_CFG.lock()?,
        STATIC_PASSWORD.lock()?,
        STATIC_PASSWORD_LOCK.lock()?,
    );

    command.remove(title);
    Ok(())
}
