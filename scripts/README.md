# 快速开始脚本集合

本目录包含用于简化开发和部署流程的脚本。

## Windows 脚本

### download-binaries.ps1

自动下载 yt-dlp 和 ffmpeg 二进制文件到 `src-tauri/binaries/` 目录。

**使用方法**:
```powershell
.\scripts\download-binaries.ps1
```

### build-windows.ps1

一键构建 Windows 安装包。

**使用方法**:
```powershell
.\scripts\build-windows.ps1
```

## macOS/Linux 脚本

### download-binaries.sh

自动下载 yt-dlp 和 ffmpeg 二进制文件。

**使用方法**:
```bash
chmod +x scripts/download-binaries.sh
./scripts/download-binaries.sh
```

### build-mac.sh

一键构建 macOS Universal Binary。

**使用方法**:
```bash
chmod +x scripts/build-mac.sh
./scripts/build-mac.sh
```

## 通用脚本

所有平台均可使用 npm scripts：

```bash
# 开发模式
npm run tauri:dev

# 构建（自动检测平台）
npm run tauri:build

# 仅构建前端
npm run build
```
