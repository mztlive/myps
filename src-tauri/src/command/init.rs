use std::{fs, path::Path};

use crate::{error::business_error::BusinessError, rsa::gen::gen_keys};

use super::static_var::{STATIC_CFG, STATIC_PASSWORD, STATIC_PASSWORD_LOCK};

#[tauri::command]
pub fn set_cfg(password: &str, pem_path: &str, db_dir: &str) -> Result<(), BusinessError> {
    let mut cfg = STATIC_CFG.lock()?;
    let mut ps = STATIC_PASSWORD.lock()?;
    let mut lock = STATIC_PASSWORD_LOCK.lock()?;

    cfg.db_dir = db_dir.to_string();
    cfg.pem_path = pem_path.to_string();
    *ps = password.to_string();
    *lock = false;

    // 文件检测， 如果不存在就创建
    let pub_key = format!("{}/public.pem", pem_path);
    let priv_key = format!("{}/private.pem", pem_path);
    let db = format!("{}/ps.data", db_dir);

    if !Path::new(pub_key.as_str()).exists() || !Path::new(priv_key.as_str()).exists() {
        gen_keys(pem_path, password)?;
    }

    // 创建一个空的db文件
    if !Path::new(db.as_str()).exists() {
        fs::write(db, "")?;
    }

    Ok(())
}
