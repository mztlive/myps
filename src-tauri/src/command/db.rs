use std::fs;

use crate::error::business_error::BusinessError;

use super::static_var::{STATIC_CFG, STATIC_DB};

const SPLIT_CHAR: &str = "\r\t";

/// 加载db的数据到内存
/// 不会重复加载
#[tauri::command]
pub fn load() -> Result<Vec<String>, BusinessError> {
    let cfg = STATIC_CFG.lock()?;
    let mut map = STATIC_DB.lock()?;

    // 如果内存中是空的，则从文件中读取
    if map.is_empty() {
        let db_path = format!("{}/ps.data", &cfg.db_dir);
        let db_bytes = fs::read(db_path).unwrap();
        let db_str = String::from_utf8(db_bytes).unwrap();
        let lines = db_str.split("\n").collect::<Vec<&str>>();
        for line in lines {
            let parts = line.split(SPLIT_CHAR).collect::<Vec<&str>>();
            if parts.len() == 2 {
                map.insert(parts[0].to_string(), parts[1].to_string());
            }
        }
    }

    let mut titles: Vec<String> = Vec::new();
    for (title, _) in map.iter() {
        titles.push(title.to_string());
    }

    Ok(titles)
}

// 将数据写入文件
pub fn down() -> Result<(), BusinessError> {
    let cfg = STATIC_CFG.lock()?;
    let map = STATIC_DB.lock()?;

    if cfg.db_dir.is_empty() {
        return Err(BusinessError::IoError("没有配置数据库目录".to_string()));
    }

    if map.len() < 1 {
        return Ok(());
    }

    let db_path = format!("{}/ps.data", &cfg.db_dir);
    let bak_db_path = format!("{}/ps.data.bak", &cfg.db_dir);

    fs::rename(db_path.clone(), bak_db_path)?;

    let mut db_str = String::new();
    for (key, value) in map.iter() {
        let line = format!("{}{}{}\n", key, SPLIT_CHAR, value);
        db_str.push_str(&line);
    }

    fs::write(db_path.clone(), db_str.as_bytes())?;
    Ok(())
}
