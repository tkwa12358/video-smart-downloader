// Prevents additional console window on Windows in release
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::{Deserialize, Serialize};
use std::path::PathBuf;
use std::process::{Command, Stdio};
use std::env;
use anyhow::{Result, anyhow};

// 视频格式信息
#[derive(Debug, Serialize, Deserialize)]
struct VideoFormat {
    format_id: String,
    resolution: String,
    filesize: u64,
    ext: String,
}

// 视频信息
#[derive(Debug, Serialize, Deserialize)]
struct VideoInfo {
    title: String,
    thumbnail: String,
    formats: Vec<VideoFormat>,
}

// 代理状态
#[derive(Debug, Serialize, Deserialize)]
struct ProxyStatus {
    has_proxy: bool,
    can_access_youtube: bool,
    message: String,
}

// 应用设置
#[derive(Debug, Serialize, Deserialize)]
struct AppSettings {
    auto_update: bool,
}

// 获取 yt-dlp 可执行文件路径
fn get_ytdlp_path() -> Result<PathBuf> {
    let mut path = env::current_exe()?;
    path.pop(); // 移除可执行文件名

    #[cfg(target_os = "macos")]
    {
        path.pop();
        path.push("Resources");
        path.push("binaries");
    }
    #[cfg(target_os = "windows")]
    {
        path.push("binaries");
    }

    path.push("yt-dlp");

    #[cfg(target_os = "windows")]
    path.set_extension("exe");

    if !path.exists() {
        return Err(anyhow!("找不到 yt-dlp，请确保已正确安装"));
    }

    Ok(path)
}

// 获取下载目录
fn get_download_dir() -> Result<PathBuf> {
    let download_dir = dirs::download_dir()
        .ok_or_else(|| anyhow!("无法获取下载目录"))?;

    let video_dir = download_dir.join("videocap");

    if !video_dir.exists() {
        std::fs::create_dir_all(&video_dir)?;
    }

    Ok(video_dir)
}

// 获取系统代理设置
fn get_system_proxy() -> Option<String> {
    // macOS
    #[cfg(target_os = "macos")]
    {
        if let Ok(output) = Command::new("scutil")
            .args(&["--proxy"])
            .output()
        {
            let output_str = String::from_utf8_lossy(&output.stdout);
            if output_str.contains("HTTPEnable : 1") || output_str.contains("HTTPSEnable : 1") {
                // 尝试提取代理地址
                for line in output_str.lines() {
                    if line.contains("HTTPProxy :") || line.contains("HTTPSProxy :") {
                        if let Some(proxy) = line.split(':').nth(1) {
                            let proxy = proxy.trim();
                            if !proxy.is_empty() {
                                // 获取端口
                                for port_line in output_str.lines() {
                                    if port_line.contains("HTTPPort :") || port_line.contains("HTTPSPort :") {
                                        if let Some(port) = port_line.split(':').nth(1) {
                                            return Some(format!("http://{}:{}", proxy, port.trim()));
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    // Windows
    #[cfg(target_os = "windows")]
    {
        if let Ok(output) = Command::new("reg")
            .args(&["query", "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings", "/v", "ProxyServer"])
            .output()
        {
            let output_str = String::from_utf8_lossy(&output.stdout);
            if let Some(line) = output_str.lines().find(|l| l.contains("ProxyServer")) {
                if let Some(proxy) = line.split_whitespace().last() {
                    if !proxy.is_empty() && proxy != "REG_SZ" {
                        return Some(format!("http://{}", proxy));
                    }
                }
            }
        }
    }

    // 检查环境变量
    if let Ok(http_proxy) = env::var("HTTP_PROXY") {
        return Some(http_proxy);
    }
    if let Ok(https_proxy) = env::var("HTTPS_PROXY") {
        return Some(https_proxy);
    }

    None
}

// 检测代理状态
#[tauri::command]
async fn check_proxy_status() -> Result<ProxyStatus, String> {
    let has_proxy = get_system_proxy().is_some();

    // 尝试访问 YouTube
    let client = reqwest::Client::builder()
        .timeout(std::time::Duration::from_secs(5))
        .build()
        .map_err(|e| e.to_string())?;

    let can_access_youtube = client
        .get("https://www.youtube.com")
        .send()
        .await
        .is_ok();

    let message = if can_access_youtube {
        if has_proxy {
            "已检测到系统代理，网络畅通。".to_string()
        } else {
            "网络畅通，可直接下载。".to_string()
        }
    } else {
        if has_proxy {
            "检测到代理但无法访问 YouTube，请检查代理设置。".to_string()
        } else {
            "无法访问 YouTube，建议启用系统代理后重试。".to_string()
        }
    };

    Ok(ProxyStatus {
        has_proxy,
        can_access_youtube,
        message,
    })
}

// 解析视频信息
#[tauri::command]
async fn parse_video(url: String) -> Result<VideoInfo, String> {
    let ytdlp_path = get_ytdlp_path().map_err(|e| e.to_string())?;

    let mut cmd = Command::new(&ytdlp_path);
    cmd.args(&[
        "--dump-json",
        "--no-warnings",
        "--no-playlist",
        &url
    ]);

    // 应用代理设置
    if let Some(proxy) = get_system_proxy() {
        cmd.arg("--proxy").arg(&proxy);
    }

    let output = cmd.output().map_err(|e| format!("执行 yt-dlp 失败: {}", e))?;

    if !output.status.success() {
        let error = String::from_utf8_lossy(&output.stderr);
        return Err(format!("解析失败: {}", error));
    }

    let json_str = String::from_utf8_lossy(&output.stdout);
    let json: serde_json::Value = serde_json::from_str(&json_str)
        .map_err(|e| format!("解析 JSON 失败: {}", e))?;

    // 提取视频信息
    let title = json["title"].as_str().unwrap_or("未知标题").to_string();
    let thumbnail = json["thumbnail"].as_str().unwrap_or("").to_string();

    // 提取格式信息（筛选常见分辨率）
    let mut formats = Vec::new();
    let resolutions = vec!["144", "240", "360", "480", "720", "1080", "1440", "2160"];

    if let Some(formats_array) = json["formats"].as_array() {
        for format in formats_array {
            if let Some(height) = format["height"].as_u64() {
                let height_str = height.to_string();
                if resolutions.contains(&height_str.as_str()) {
                    // 只选择有视频和音频的格式，或纯视频格式
                    if let Some(vcodec) = format["vcodec"].as_str() {
                        if vcodec != "none" {
                            let format_id = format["format_id"].as_str().unwrap_or("").to_string();
                            let ext = format["ext"].as_str().unwrap_or("mp4").to_string();
                            let filesize = format["filesize"].as_u64().unwrap_or(0);
                            let resolution = format!("{}p", height);

                            formats.push(VideoFormat {
                                format_id,
                                resolution,
                                filesize,
                                ext,
                            });
                        }
                    }
                }
            }
        }
    }

    // 按分辨率从高到低排序
    formats.sort_by(|a, b| {
        let a_height: u32 = a.resolution.trim_end_matches('p').parse().unwrap_or(0);
        let b_height: u32 = b.resolution.trim_end_matches('p').parse().unwrap_or(0);
        b_height.cmp(&a_height)
    });

    // 去重
    formats.dedup_by(|a, b| a.resolution == b.resolution);

    if formats.is_empty() {
        return Err("未找到支持的视频格式".to_string());
    }

    Ok(VideoInfo {
        title,
        thumbnail,
        formats,
    })
}

// 下载视频
#[tauri::command]
async fn download_video(url: String, format_id: String, title: String) -> Result<(), String> {
    let ytdlp_path = get_ytdlp_path().map_err(|e| e.to_string())?;
    let download_dir = get_download_dir().map_err(|e| e.to_string())?;

    // 创建视频专属目录（使用安全的文件名）
    let safe_title = title
        .chars()
        .map(|c| if c.is_alphanumeric() || c == ' ' { c } else { '_' })
        .collect::<String>();

    let video_dir = download_dir.join(&safe_title);
    std::fs::create_dir_all(&video_dir).map_err(|e| e.to_string())?;

    // 构建下载命令
    let mut cmd = Command::new(&ytdlp_path);
    cmd.args(&[
        "-f", &format_id,
        "--write-subs",
        "--write-auto-sub",
        "--sub-lang", "zh-Hans,zh-Hant,en",
        "--convert-subs", "srt",
        "--embed-subs",
        "-o", &format!("{}/%(title)s.%(ext)s", video_dir.to_string_lossy()),
        &url
    ]);

    // 应用代理设置
    if let Some(proxy) = get_system_proxy() {
        cmd.arg("--proxy").arg(&proxy);
    }

    // 执行下载
    let output = cmd
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .output()
        .map_err(|e| format!("执行下载失败: {}", e))?;

    if !output.status.success() {
        let error = String::from_utf8_lossy(&output.stderr);
        return Err(format!("下载失败: {}", error));
    }

    Ok(())
}

// 更新 yt-dlp
#[tauri::command]
async fn update_ytdlp() -> Result<(), String> {
    let ytdlp_path = get_ytdlp_path().map_err(|e| e.to_string())?;

    let output = Command::new(&ytdlp_path)
        .arg("-U")
        .output()
        .map_err(|e| format!("更新失败: {}", e))?;

    if !output.status.success() {
        let error = String::from_utf8_lossy(&output.stderr);
        return Err(format!("更新失败: {}", error));
    }

    Ok(())
}

// 加载设置
#[tauri::command]
fn load_settings() -> Result<AppSettings, String> {
    let config_dir = dirs::config_dir()
        .ok_or_else(|| "无法获取配置目录".to_string())?;

    let config_file = config_dir.join("video-smart-downloader").join("settings.json");

    if config_file.exists() {
        let content = std::fs::read_to_string(&config_file)
            .map_err(|e| format!("读取设置失败: {}", e))?;

        serde_json::from_str(&content)
            .map_err(|e| format!("解析设置失败: {}", e))
    } else {
        Ok(AppSettings {
            auto_update: false,
        })
    }
}

// 保存设置
#[tauri::command]
fn save_settings(auto_update: bool) -> Result<(), String> {
    let config_dir = dirs::config_dir()
        .ok_or_else(|| "无法获取配置目录".to_string())?;

    let app_config_dir = config_dir.join("video-smart-downloader");
    std::fs::create_dir_all(&app_config_dir)
        .map_err(|e| format!("创建配置目录失败: {}", e))?;

    let config_file = app_config_dir.join("settings.json");

    let settings = AppSettings { auto_update };

    let json = serde_json::to_string_pretty(&settings)
        .map_err(|e| format!("序列化设置失败: {}", e))?;

    std::fs::write(&config_file, json)
        .map_err(|e| format!("保存设置失败: {}", e))?;

    Ok(())
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            parse_video,
            download_video,
            check_proxy_status,
            update_ytdlp,
            load_settings,
            save_settings
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
