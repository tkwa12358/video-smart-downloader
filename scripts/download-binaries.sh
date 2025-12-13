#!/bin/bash

# macOS 二进制文件下载脚本

set -e

echo "================================================"
echo "  视频智能下载器 - 二进制文件下载脚本 (macOS)"
echo "================================================"
echo ""

# 创建 binaries 目录
mkdir -p src-tauri/binaries

# 下载 yt-dlp
echo "[1/2] 下载 yt-dlp..."
curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp \
  -o src-tauri/binaries/yt-dlp

chmod +x src-tauri/binaries/yt-dlp
echo "✓ yt-dlp 下载完成"

# 检查 ffmpeg
echo ""
echo "[2/2] 检查 ffmpeg..."

if command -v ffmpeg &> /dev/null; then
    echo "✓ 系统已安装 ffmpeg"
    echo "复制 ffmpeg 到项目..."

    # 复制 ffmpeg
    cp $(which ffmpeg) src-tauri/binaries/ffmpeg
    chmod +x src-tauri/binaries/ffmpeg

    echo "✓ ffmpeg 复制完成"
else
    echo "⚠️  系统未安装 ffmpeg"
    echo ""
    echo "请先安装 ffmpeg："
    echo "  brew install ffmpeg"
    echo ""
    echo "然后重新运行此脚本。"
    exit 1
fi

# 验证文件
echo ""
echo "================================================"
echo "验证二进制文件..."
echo "================================================"

ls -lh src-tauri/binaries/

echo ""
echo "✓ 所有二进制文件准备完成！"
echo ""
echo "现在可以运行以下命令构建应用："
echo "  npm run tauri:build:mac"
echo ""
