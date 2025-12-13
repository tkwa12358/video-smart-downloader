# 🚀 如何发布到 GitHub 并自动构建

## 步骤 1: 在 GitHub 上创建仓库

1. 访问 https://github.com/new
2. 填写信息：
   - **Repository name**: `video-smart-downloader`
   - **Description**: `智能视频下载器 - 支持 YouTube、TikTok、Bilibili、抖音等 1000+ 平台`
   - **Public** 或 **Private**（选择一个）
   - ❌ **不要**勾选 "Add a README file"
   - ❌ **不要**勾选 "Add .gitignore"
   - ❌ **不要**勾选 "Choose a license"
3. 点击 **"Create repository"**

## 步骤 2: 推送代码到 GitHub

在终端运行（将 `YOUR_USERNAME` 替换为你的 GitHub 用户名）：

```bash
cd ~/video-smart-downloader

# 添加远程仓库
git remote add origin https://github.com/YOUR_USERNAME/video-smart-downloader.git

# 推送代码
git push -u origin main
```

## 步骤 3: 创建第一个 Release（触发自动构建）

推送代码后，创建一个版本标签来触发自动构建：

```bash
# 创建标签
git tag v1.0.0

# 推送标签
git push origin v1.0.0
```

**或者**在 GitHub 网页操作：

1. 进入你的仓库页面
2. 点击右侧 **"Releases"** → **"Create a new release"**
3. 点击 **"Choose a tag"** → 输入 `v1.0.0` → 点击 **"Create new tag"**
4. **Release title**: `v1.0.0 - 首次发布`
5. **Description**:
   ```
   ## ✨ 功能
   - 支持 YouTube、TikTok、Bilibili、抖音等 1000+ 平台
   - 暗蓝黑色主题界面
   - 自动代理检测
   - 多分辨率选择（144p-4K）
   - 官方字幕下载

   ## 📦 下载
   - **macOS**: video-smart-downloader_1.0.0_universal.dmg（支持 Intel + Apple Silicon）
   - **Windows**: video-smart-downloader_1.0.0_x64-setup.exe
   ```
6. 点击 **"Publish release"**

## 步骤 4: 等待自动构建完成

1. 点击仓库顶部的 **"Actions"** 标签
2. 你会看到正在运行的构建任务
3. 等待大约 **10-20 分钟**
4. 构建完成后，安装包会自动上传到 Release 页面

## 步骤 5: 下载安装包

1. 进入 **"Releases"** 页面
2. 下载：
   - `video-smart-downloader_1.0.0_universal.dmg`（macOS）
   - `video-smart-downloader_1.0.0_x64-setup.exe`（Windows）

## 🎉 完成！

现在你可以：
- 分享 Release 页面链接给用户
- 用户直接下载 `.dmg` 或 `.exe` 安装

---

## 📌 后续更新流程

每次更新代码后：

```bash
# 1. 提交更改
git add .
git commit -m "更新说明"
git push

# 2. 创建新版本标签
git tag v1.0.1
git push origin v1.0.1

# 3. 自动构建开始
# 等待 10-20 分钟后，新版本自动发布
```

---

## ⚙️ 手动触发构建（不创建 Release）

如果只想测试构建，不发布：

1. 进入 GitHub 仓库
2. 点击 **"Actions"** 标签
3. 选择 **"构建和发布"** workflow
4. 点击右侧 **"Run workflow"** → **"Run workflow"**
5. 等待构建完成
6. 在 **Artifacts** 中下载构建产物（仅保留 90 天）

---

## 🔧 故障排除

### Q: Actions 构建失败？

1. 点击失败的任务查看日志
2. 常见问题：
   - yt-dlp 下载失败 → 重新运行 workflow
   - ffmpeg 下载失败 → 检查网络
   - Rust 编译错误 → 检查代码语法

### Q: 如何删除错误的 Release？

1. 进入 **Releases** 页面
2. 点击要删除的 Release → **"Delete"**
3. 删除对应的 Git tag:
   ```bash
   git tag -d v1.0.0
   git push origin :refs/tags/v1.0.0
   ```

---

**祝你构建顺利！** 🚀
