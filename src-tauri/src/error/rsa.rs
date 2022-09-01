use openssl::error::ErrorStack;

#[derive(Debug, serde::Serialize)]
pub enum RsaError {
    PasswordIsEmpty,

    PemError(String),
    SaveError(String),
}

impl std::fmt::Display for RsaError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match *self {
            RsaError::PasswordIsEmpty => write!(f, "password is empty"),
            RsaError::PemError(ref err) => write!(f, "pem gen failed: {}", err),
            RsaError::SaveError(ref err) => write!(f, "save pem failed: {}", err),
        }
    }
}

impl std::error::Error for RsaError {
    fn source(&self) -> Option<&(dyn std::error::Error + 'static)> {
        match *self {
            RsaError::PasswordIsEmpty => None,
            RsaError::PemError(_) => None,
            RsaError::SaveError(_) => None,
        }
    }
}

impl From<std::io::Error> for RsaError {
    fn from(err: std::io::Error) -> Self {
        RsaError::SaveError(err.to_string())
    }
}

impl From<ErrorStack> for RsaError {
    fn from(err: ErrorStack) -> Self {
        RsaError::PemError(err.to_string())
    }
}
