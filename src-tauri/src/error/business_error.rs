use std::{
    collections::HashMap,
    sync::{MutexGuard, PoisonError},
};

use crate::command::structs::Config;

use super::rsa::RsaError;

#[derive(Debug, serde::Serialize)]
pub enum BusinessError {
    RsaError(String),
    IoError(String),
    OtherError(String),
    NoSetPassword,
}

impl std::fmt::Display for BusinessError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match *self {
            BusinessError::RsaError(ref err) => write!(f, "加解密失败，具体原因是： {}", err),
            BusinessError::IoError(ref err) => write!(f, "操作文件失败，具体原因是： {}", err),
            BusinessError::OtherError(ref err) => write!(f, "其他错误，具体原因是： {}", err),
            BusinessError::NoSetPassword => write!(f, "请输入密码"),
        }
    }
}

impl std::error::Error for BusinessError {
    fn source(&self) -> Option<&(dyn std::error::Error + 'static)> {
        match *self {
            BusinessError::RsaError(_) => None,
            BusinessError::IoError(_) => None,
            BusinessError::OtherError(_) => None,
            BusinessError::NoSetPassword => None,
        }
    }
}

impl From<std::io::Error> for BusinessError {
    fn from(err: std::io::Error) -> Self {
        BusinessError::IoError(err.to_string())
    }
}

impl From<RsaError> for BusinessError {
    fn from(err: RsaError) -> Self {
        BusinessError::RsaError(err.to_string())
    }
}

impl From<PoisonError<MutexGuard<'_, ()>>> for BusinessError {
    fn from(_: PoisonError<MutexGuard<'_, ()>>) -> Self {
        BusinessError::OtherError("mutex poisoned".to_string())
    }
}

impl From<PoisonError<MutexGuard<'_, bool>>> for BusinessError {
    fn from(_: PoisonError<MutexGuard<'_, bool>>) -> Self {
        BusinessError::OtherError("mutex poisoned".to_string())
    }
}

impl From<PoisonError<MutexGuard<'_, String>>> for BusinessError {
    fn from(_: PoisonError<MutexGuard<'_, String>>) -> Self {
        BusinessError::OtherError("mutex poisoned".to_string())
    }
}

impl From<PoisonError<MutexGuard<'_, HashMap<String, String>>>> for BusinessError {
    fn from(_: PoisonError<MutexGuard<'_, HashMap<String, String>>>) -> Self {
        BusinessError::OtherError("mutex poisoned".to_string())
    }
}

impl From<PoisonError<MutexGuard<'_, Config>>> for BusinessError {
    fn from(_: PoisonError<MutexGuard<'_, Config>>) -> Self {
        BusinessError::OtherError("mutex poisoned".to_string())
    }
}
