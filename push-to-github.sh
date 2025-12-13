#!/bin/bash

# 视频智能下载器 - 推送到 GitHub 脚本
# 使用方法: chmod +x push-to-github.sh && ./push-to-github.sh

set -e

echo "🚀 准备推送到 GitHub..."
echo ""

# GitHub 用户名（根据您的 git 配置自动填充）
GITHUB_USERNAME="szkking"
REPO_NAME="video-smart-downloader"

echo "📦 仓库信息："
echo "  用户名: $GITHUB_USERNAME"
echo "  仓库名: $REPO_NAME"
echo "  远程地址: https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"
echo ""

# 检查远程仓库是否已添加
if git remote get-url origin &>/dev/null; then
    echo "⚠️  检测到已有 origin 远程仓库："
    git remote get-url origin
    read -p "是否要更新远程地址？(y/N) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git remote set-url origin "https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"
        echo "✅ 远程地址已更新"
    fi
else
    echo "➕ 添加远程仓库..."
    git remote add origin "https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"
    echo "✅ 远程仓库已添加"
fi

echo ""
echo "📤 推送代码到 GitHub..."
git push -u origin main

echo ""
echo "🏷️  创建版本标签 v1.0.0..."
git tag v1.0.0 -m "v1.0.0 - 首次发布"
git push origin v1.0.0

echo ""
echo "✅ 完成！"
echo ""
echo "📋 下一步操作："
echo "  1. 访问 https://github.com/$GITHUB_USERNAME/$REPO_NAME"
echo "  2. 点击 'Actions' 查看构建进度"
echo "  3. 等待 10-20 分钟后，在 'Releases' 页面下载安装包"
echo ""
echo "📥 安装包将包含："
echo "  - video-smart-downloader_1.0.0_universal.dmg (macOS)"
echo "  - video-smart-downloader_1.0.0_x64-setup.exe (Windows)"
echo ""
