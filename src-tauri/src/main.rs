#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod command;
mod error;
mod rsa;

use command::{db, init, lock, record, static_var::STATIC_PASSWORD_LOCK};
use std::thread;

fn main() {
    // 定时刷新密码锁
    thread::spawn(|| {
        let mut second = 0;
        loop {
            thread::sleep(std::time::Duration::from_secs(1));
            second += 1;
            if second % 600 == 0 {
                match STATIC_PASSWORD_LOCK.lock() {
                    Ok(mut lock) => *lock = true,
                    Err(_) => {}
                }
            }
        }
    });

    // 定时将数据库写入磁盘
    thread::spawn(|| loop {
        let mut second = 0;
        loop {
            thread::sleep(std::time::Duration::from_secs(1));
            second += 1;
            if second % 10 == 0 {
                match db::down() {
                    Ok(_) => {}
                    Err(e) => println!("down db failed. reasion: {}", e),
                }
            }
        }
    });

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            record::add,
            record::get_details,
            init::set_cfg,
            db::load,
            lock::unlock,
            lock::is_lock,
            record::update,
            record::remove,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
