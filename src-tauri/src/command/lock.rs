use crate::error::business_error::BusinessError;

use super::static_var::{STATIC_PASSWORD, STATIC_PASSWORD_LOCK};

/// 设置密码, 前端可多次调用
#[tauri::command]
pub fn unlock(password: &str) -> Result<(), BusinessError> {
    let mut lock = STATIC_PASSWORD_LOCK.lock()?;
    let mut pass = STATIC_PASSWORD.lock()?;
    *lock = false;
    pass.clear();
    pass.push_str(password);

    Ok(())
}

#[tauri::command]
pub fn is_lock() -> Result<bool, BusinessError> {
    let lock = STATIC_PASSWORD_LOCK.lock()?;
    let pass = STATIC_PASSWORD.lock()?;

    Ok(*lock || pass.is_empty())
}
