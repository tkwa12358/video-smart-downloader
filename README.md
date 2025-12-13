# 视频智能下载器

一个基于 Tauri + React 开发的跨平台视频下载工具，支持 YouTube、TikTok、Bilibili、抖音等 1000+ 视频平台。

## ✨ 功能特性

- 🎥 **多平台支持**：支持 YouTube、TikTok、Twitter/X、Bilibili、抖音、视频号等 1000+ 平台
- 🎨 **优雅界面**：暗蓝黑色主题，简洁易用的单窗口界面
- 📊 **清晰度选择**：支持 144p - 4K 多种分辨率选择
- 📝 **自动字幕**：自动下载官方认证字幕（.srt 格式）
- 🌐 **智能代理**：自动检测系统代理，无需手动配置
- 🔄 **自动更新**：可选的 yt-dlp 自动更新功能
- 💾 **智能存储**：自动在下载目录创建 videocap 文件夹分类管理
- ⚡ **高性能**：基于 Rust + Tauri，体积小、速度快、内存占用低

## 🖥️ 系统要求

### Windows
- Windows 10 21H2 及以上版本
- Windows 11（推荐）

### macOS
- macOS 10.15 Catalina 及以上
- 完美支持 Apple Silicon (M1/M2/M3/M4/M5)

## 📦 安装

### 下载安装包

从 [Releases](https://github.com/your-repo/releases) 页面下载对应平台的安装包：

- **Windows**: `video-smart-downloader_1.0.0_x64_setup.exe`
- **macOS Intel**: `video-smart-downloader_1.0.0_x64.dmg`
- **macOS Apple Silicon**: `video-smart-downloader_1.0.0_aarch64.dmg`
- **macOS Universal**: `video-smart-downloader_1.0.0_universal.dmg`（推荐，支持所有 Mac）

### 首次运行

1. **Windows 用户**：
   - 双击运行安装包
   - 如遇到 SmartScreen 警告，点击"更多信息" → "仍要运行"
   - 首次启动会自动检测并安装 WebView2（如系统未安装）

2. **macOS 用户**：
   - 打开 .dmg 文件，拖动应用到 Applications 文件夹
   - 首次打开时，右键点击应用 → "打开"（绕过未签名警告）

## 🚀 使用方法

1. **粘贴视频链接**：在输入框中粘贴任意支持平台的视频链接
2. **解析视频**：点击"解析"按钮，自动获取视频信息
3. **选择清晰度**：从下拉菜单选择想要的分辨率
4. **开始下载**：点击"开始下载"，视频将自动下载到：
   ```
   ~/Downloads/videocap/视频标题/
   ```

## 🌍 支持的平台

- ✅ YouTube
- ✅ TikTok（国际版）
- ✅ Twitter / X
- ✅ Bilibili（B站）
- ✅ 抖音
- ✅ 微信视频号
- ✅ Instagram
- ✅ Facebook
- ✅ Vimeo
- ✅ 小红书
- ✅ 1000+ 其他平台

## ⚙️ 设置选项

点击右上角齿轮图标可访问设置：

- **自动更新 yt-dlp**：开启后每次启动自动检查 yt-dlp 更新
- **手动更新**：立即更新 yt-dlp 到最新版本

## 🔧 网络和代理

应用会自动检测：

- ✅ 系统代理设置（Windows 和 macOS）
- ✅ 环境变量代理（HTTP_PROXY / HTTPS_PROXY）
- ✅ 网络连通性（自动测试 YouTube 访问）

如果检测到被墙网站无法访问，会自动提示启用代理。

## 🛠️ 开发构建

详见 [DEPLOYMENT.md](./DEPLOYMENT.md)

## 📄 许可证

MIT License

## 🙏 鸣谢

- [Tauri](https://tauri.app/) - 跨平台桌面应用框架
- [yt-dlp](https://github.com/yt-dlp/yt-dlp) - 强大的视频下载工具
- [React](https://react.dev/) - 前端框架
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架
