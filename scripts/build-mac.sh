#!/bin/bash

# macOS 构建脚本 - Universal Binary

set -e

echo "================================================"
echo "  视频智能下载器 - macOS 构建脚本"
echo "================================================"
echo ""

# 检查 Rust 工具链
echo "[1/5] 检查 Rust 工具链..."
if ! command -v rustc &> /dev/null; then
    echo "❌ 未安装 Rust，请先安装："
    echo "  curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh"
    exit 1
fi
echo "✓ Rust 已安装: $(rustc --version)"

# 添加构建目标
echo ""
echo "[2/5] 添加构建目标..."
rustup target add aarch64-apple-darwin
rustup target add x86_64-apple-darwin
echo "✓ 构建目标已添加"

# 检查二进制文件
echo ""
echo "[3/5] 检查二进制文件..."
if [ ! -f "src-tauri/binaries/yt-dlp" ]; then
    echo "❌ 找不到 yt-dlp，请先运行："
    echo "  ./scripts/download-binaries.sh"
    exit 1
fi
if [ ! -f "src-tauri/binaries/ffmpeg" ]; then
    echo "❌ 找不到 ffmpeg，请先运行："
    echo "  ./scripts/download-binaries.sh"
    exit 1
fi
echo "✓ 二进制文件已就绪"

# 安装前端依赖
echo ""
echo "[4/5] 安装前端依赖..."
npm install
echo "✓ 依赖安装完成"

# 构建应用
echo ""
echo "[5/5] 构建 Universal Binary..."
echo ""
npm run tauri:build:mac

# 完成
echo ""
echo "================================================"
echo "✓ 构建完成！"
echo "================================================"
echo ""
echo "安装包位置："
echo "  src-tauri/target/release/bundle/dmg/video-smart-downloader_1.0.0_universal.dmg"
echo ""
echo "文件大小："
du -h src-tauri/target/release/bundle/dmg/*.dmg
echo ""
