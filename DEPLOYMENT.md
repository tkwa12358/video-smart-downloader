# 部署和打包文档

本文档详细说明如何构建、打包和部署视频智能下载器。

## 📋 目录

1. [开发环境准备](#开发环境准备)
2. [安装依赖](#安装依赖)
3. [开发调试](#开发调试)
4. [准备二进制文件](#准备二进制文件)
5. [Windows 打包](#windows-打包)
6. [macOS 打包](#macos-打包)
7. [常见问题](#常见问题)

---

## 🔧 开发环境准备

### 1. 安装 Rust

**Windows**:
```powershell
# 下载并运行 rustup-init.exe
https://win.rustup.rs/

# 或使用 Chocolatey
choco install rust
```

**macOS**:
```bash
# 使用官方安装脚本
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# 或使用 Homebrew
brew install rust
```

验证安装：
```bash
rustc --version
cargo --version
```

### 2. 安装 Node.js

**要求**: Node.js >= 18.0

**Windows**:
```powershell
# 下载安装包
https://nodejs.org/

# 或使用 Chocolatey
choco install nodejs
```

**macOS**:
```bash
# 使用 Homebrew
brew install node

# 或使用 nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 20
nvm use 20
```

验证安装：
```bash
node --version
npm --version
```

### 3. 安装 Tauri CLI

```bash
# 全局安装
npm install -g @tauri-apps/cli

# 或在项目中安装（已包含在 package.json）
npm install
```

### 4. macOS 额外要求

安装 Xcode Command Line Tools：
```bash
xcode-select --install
```

---

## 📥 安装依赖

克隆项目后，安装所有依赖：

```bash
cd video-smart-downloader

# 安装前端依赖
npm install

# Rust 依赖会在首次构建时自动下载
```

---

## 🐛 开发调试

### 启动开发服务器

```bash
npm run tauri:dev
```

这会同时启动：
- Vite 开发服务器（前端热重载）
- Tauri 应用窗口（后端自动编译）

### 仅前端开发

如果只需要调试前端界面：

```bash
npm run dev
```

然后在浏览器访问 `http://localhost:1420`

---

## 📦 准备二进制文件

在打包应用前，必须准备 `yt-dlp` 和 `ffmpeg` 二进制文件。

### 创建 binaries 目录

```bash
mkdir -p src-tauri/binaries
```

### 下载 yt-dlp

**Windows**:
```powershell
# 下载 Windows 版本
Invoke-WebRequest -Uri "https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp.exe" -OutFile "src-tauri/binaries/yt-dlp.exe"
```

**macOS**:
```bash
# 下载 macOS 版本
curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o src-tauri/binaries/yt-dlp

# 赋予执行权限
chmod +x src-tauri/binaries/yt-dlp
```

### 下载 ffmpeg

**Windows**:

1. 访问 [ffmpeg官网](https://www.gyan.dev/ffmpeg/builds/)
2. 下载 `ffmpeg-release-essentials.zip`
3. 解压后，将 `ffmpeg.exe` 复制到 `src-tauri/binaries/`

**macOS**:

```bash
# 使用 Homebrew 安装
brew install ffmpeg

# 复制到项目（根据你的架构选择）
# Intel Mac:
cp /usr/local/bin/ffmpeg src-tauri/binaries/ffmpeg

# Apple Silicon Mac:
cp /opt/homebrew/bin/ffmpeg src-tauri/binaries/ffmpeg

# 赋予执行权限
chmod +x src-tauri/binaries/ffmpeg
```

### 验证二进制文件

```bash
# 检查文件是否存在
ls -lh src-tauri/binaries/

# 应该看到：
# yt-dlp 或 yt-dlp.exe
# ffmpeg 或 ffmpeg.exe
```

---

## 🪟 Windows 打包

### 1. 构建 Windows 安装包

```bash
npm run tauri:build:windows
```

或使用默认构建（自动检测平台）：
```bash
npm run tauri:build
```

### 2. 构建产物位置

```
src-tauri/target/release/bundle/
├── nsis/
│   └── video-smart-downloader_1.0.0_x64-setup.exe  ← Windows 安装包
└── msi/
    └── video-smart-downloader_1.0.0_x64_en-US.msi  ← MSI 安装包
```

### 3. WebView2 打包选项

在 `src-tauri/tauri.conf.json` 中配置：

**选项 A: 在线下载（推荐，体积小）**
```json
"windows": {
  "webviewInstallMode": {
    "type": "downloadBootstrapper"
  }
}
```
- 安装包体积：~5-10MB
- 首次运行时自动下载 WebView2（~100MB）

**选项 B: 离线安装包（体积大）**
```json
"windows": {
  "webviewInstallMode": {
    "type": "embedBootstrapper"
  }
}
```
- 安装包体积：~120-150MB
- 包含 WebView2 安装器，完全离线

**选项 C: 固定版本（企业部署）**
```json
"windows": {
  "webviewInstallMode": {
    "type": "fixedRuntime",
    "path": "path/to/webview2/runtime"
  }
}
```

### 4. 代码签名（可选但推荐）

为避免 Windows Defender SmartScreen 警告：

```bash
# 购买代码签名证书后
# 在 tauri.conf.json 中配置
{
  "bundle": {
    "windows": {
      "certificateThumbprint": "YOUR_CERT_THUMBPRINT",
      "digestAlgorithm": "sha256",
      "timestampUrl": "http://timestamp.digicert.com"
    }
  }
}
```

---

## 🍎 macOS 打包

### 1. 构建 Universal Binary（推荐）

支持 Intel 和 Apple Silicon 的通用包：

```bash
npm run tauri:build:mac
```

这会构建 Universal Binary，同时支持：
- Intel Mac (x86_64)
- Apple Silicon Mac (M1/M2/M3/M4/M5)

### 2. 构建特定架构

**仅 Apple Silicon**:
```bash
npm run tauri build -- --target aarch64-apple-darwin
```

**仅 Intel Mac**:
```bash
npm run tauri build -- --target x86_64-apple-darwin
```

### 3. 构建产物位置

```
src-tauri/target/release/bundle/
├── dmg/
│   ├── video-smart-downloader_1.0.0_x64.dmg          ← Intel Mac
│   ├── video-smart-downloader_1.0.0_aarch64.dmg      ← Apple Silicon
│   └── video-smart-downloader_1.0.0_universal.dmg    ← Universal (推荐)
└── macos/
    └── video-smart-downloader.app
```

### 4. 代码签名和公证（可选但强烈推荐）

**为什么需要？**
- 避免"已损坏，无法打开"警告
- 通过 Gatekeeper 验证
- 可通过 App Store 分发

**步骤**:

#### a. 加入 Apple Developer Program

访问 https://developer.apple.com/ 并支付 $99/年

#### b. 创建开发者证书

```bash
# 在 Keychain Access 中创建证书签名请求（CSR）
# 然后在 Apple Developer 网站创建 "Developer ID Application" 证书
```

#### c. 配置 tauri.conf.json

```json
{
  "bundle": {
    "macOS": {
      "signingIdentity": "Developer ID Application: Your Name (TEAM_ID)"
    }
  }
}
```

#### d. 公证应用

创建 `notarize.sh` 脚本：

```bash
#!/bin/bash

# 上传到 Apple 公证服务
xcrun notarytool submit \
  "src-tauri/target/release/bundle/dmg/video-smart-downloader_1.0.0_universal.dmg" \
  --apple-id "your-apple-id@example.com" \
  --password "your-app-specific-password" \
  --team-id "YOUR_TEAM_ID" \
  --wait

# 公证完成后，装订公证票据
xcrun stapler staple \
  "src-tauri/target/release/bundle/dmg/video-smart-downloader_1.0.0_universal.dmg"
```

运行：
```bash
chmod +x notarize.sh
./notarize.sh
```

### 5. 未签名应用的临时解决方案

如果不想签名，用户首次打开时需要：

1. 右键点击应用
2. 选择"打开"
3. 在弹出对话框中点击"打开"

或在终端执行：
```bash
xattr -cr /Applications/video-smart-downloader.app
```

---

## 🎯 完整打包流程

### Windows 完整流程

```bash
# 1. 准备环境
# 确保已安装 Rust + Node.js

# 2. 克隆项目
git clone <your-repo>
cd video-smart-downloader

# 3. 安装依赖
npm install

# 4. 下载二进制文件
# 手动下载 yt-dlp.exe 和 ffmpeg.exe 到 src-tauri/binaries/

# 5. 构建应用
npm run tauri:build:windows

# 6. 安装包位置
# src-tauri/target/release/bundle/nsis/video-smart-downloader_1.0.0_x64-setup.exe
```

### macOS 完整流程

```bash
# 1. 准备环境
# 确保已安装 Rust + Node.js + Xcode CLI Tools

# 2. 克隆项目
git clone <your-repo>
cd video-smart-downloader

# 3. 安装依赖
npm install

# 4. 下载二进制文件
curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp \
  -o src-tauri/binaries/yt-dlp
chmod +x src-tauri/binaries/yt-dlp

# 复制 ffmpeg（需先安装 Homebrew 和 ffmpeg）
cp $(which ffmpeg) src-tauri/binaries/ffmpeg
chmod +x src-tauri/binaries/ffmpeg

# 5. 添加构建目标（Universal Binary）
rustup target add aarch64-apple-darwin
rustup target add x86_64-apple-darwin

# 6. 构建应用
npm run tauri:build:mac

# 7. 安装包位置
# src-tauri/target/release/bundle/dmg/video-smart-downloader_1.0.0_universal.dmg
```

---

## 🌐 准备图标

### 生成图标文件

创建 `src-tauri/icons/` 目录并放置图标：

```bash
mkdir -p src-tauri/icons
```

**需要的图标尺寸**:

- **Windows**: `icon.ico`（包含 16x16, 32x32, 48x48, 256x256）
- **macOS**: `icon.icns`（包含多种尺寸）
- **PNG**: 32x32.png, 128x128.png, 128x128@2x.png

**推荐工具**:

- [Tauri Icon Generator](https://icon-generator.vercel.app/)（在线生成）
- ImageMagick（命令行工具）

**使用 ImageMagick 生成**:

```bash
# 从 1024x1024 的 PNG 生成所有尺寸
convert icon-1024.png -resize 32x32 src-tauri/icons/32x32.png
convert icon-1024.png -resize 128x128 src-tauri/icons/128x128.png
convert icon-1024.png -resize 256x256 src-tauri/icons/128x128@2x.png

# 生成 .ico (Windows)
convert icon-1024.png -define icon:auto-resize=256,128,64,48,32,16 src-tauri/icons/icon.ico

# 生成 .icns (macOS，需要 png2icns)
png2icns src-tauri/icons/icon.icns icon-1024.png
```

---

## ❓ 常见问题

### Q1: 构建失败，提示找不到 yt-dlp

**解决方案**: 确保 `src-tauri/binaries/yt-dlp` 存在且有执行权限

```bash
ls -lh src-tauri/binaries/
chmod +x src-tauri/binaries/yt-dlp
```

### Q2: Windows 构建后应用无法运行

**解决方案**: 检查是否安装了 WebView2

```powershell
# 检查 WebView2 是否已安装
Get-AppxPackage -Name *WebView*
```

如果未安装，下载安装：https://go.microsoft.com/fwlink/p/?LinkId=2124703

### Q3: macOS 提示"已损坏，无法打开"

**解决方案**:

```bash
# 移除隔离属性
xattr -cr /Applications/video-smart-downloader.app

# 或允许任何来源（需要管理员权限）
sudo spctl --master-disable
```

### Q4: 代理检测不工作

**原因**: 某些代理软件不修改系统设置

**解决方案**: 手动设置环境变量

```bash
# macOS/Linux
export HTTP_PROXY=http://127.0.0.1:7890
export HTTPS_PROXY=http://127.0.0.1:7890

# Windows PowerShell
$env:HTTP_PROXY="http://127.0.0.1:7890"
$env:HTTPS_PROXY="http://127.0.0.1:7890"
```

### Q5: Apple Silicon Mac 运行 x86_64 版本很慢

**解决方案**: 使用 Universal Binary 或 aarch64 专用版本

```bash
npm run tauri build -- --target aarch64-apple-darwin
```

### Q6: 构建体积过大

**优化建议**:

1. 使用在线下载 WebView2（Windows）
2. 不包含符号表和调试信息
3. 启用 Rust 编译优化

在 `src-tauri/Cargo.toml` 添加：

```toml
[profile.release]
strip = true
opt-level = "z"
lto = true
codegen-units = 1
panic = "abort"
```

---

## 📊 构建产物对比

| 平台 | 类型 | 体积 | 说明 |
|------|------|------|------|
| **Windows** | 在线安装包 | ~85MB | 推荐，首次运行下载 WebView2 |
| **Windows** | 离线安装包 | ~205MB | 包含 WebView2 |
| **macOS** | Universal DMG | ~90MB | 支持所有 Mac |
| **macOS** | Intel DMG | ~87MB | 仅 Intel Mac |
| **macOS** | ARM DMG | ~85MB | 仅 Apple Silicon |

---

## 🚀 发布流程

### 1. 创建 GitHub Release

```bash
# 1. 打标签
git tag v1.0.0
git push origin v1.0.0

# 2. 创建 Release
# 在 GitHub 网页创建 Release，上传构建产物
```

### 2. 自动更新（可选）

配置 Tauri Updater 实现应用内自动更新。

参考: https://tauri.app/v1/guides/distribution/updater

---

## 📞 技术支持

如有问题，请提交 Issue 或查看文档：
- [Tauri 官方文档](https://tauri.app/)
- [yt-dlp 文档](https://github.com/yt-dlp/yt-dlp)

---

**祝构建顺利！🎉**
