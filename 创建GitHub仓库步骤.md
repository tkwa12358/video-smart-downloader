# 📝 如何在 GitHub 上创建仓库

## 第一步：登录 GitHub

1. 访问 https://github.com/login
2. 使用您的账户登录（邮箱：tkwa12358@outlook.com）

---

## 第二步：创建新仓库

1. 登录后，点击右上角的 **"+"** 按钮
2. 选择 **"New repository"（新建仓库）**

或者直接访问：https://github.com/new

---

## 第三步：填写仓库信息

### 必填信息：

- **Repository name（仓库名称）**：`video-smart-downloader`

### 可选信息：

- **Description（描述）**：
  ```
  智能视频下载器 - 支持 YouTube、TikTok、Bilibili、抖音等 1000+ 平台，自动代理检测
  ```

- **仓库类型**：
  - ✅ 选择 **Public（公开）** - 任何人都可以看到和下载
  - 或选择 **Private（私有）** - 只有您能看到

### 重要：不要勾选以下选项

- ❌ **不要**勾选 "Add a README file"
- ❌ **不要**勾选 "Add .gitignore"
- ❌ **不要**勾选 "Choose a license"

（因为我们已经在本地创建了这些文件）

---

## 第四步：创建仓库

点击绿色按钮 **"Create repository"**

---

## 第五步：查看您的 GitHub 用户名

创建完成后，您会看到仓库地址，格式是：
```
https://github.com/您的用户名/video-smart-downloader
```

**请记下您的用户名**，我们稍后会用到。

---

## 第六步：运行推送脚本

### 方法一：使用一键脚本（推荐）

打开终端，运行：

```bash
cd /Users/szkking/video-smart-downloader
./push-to-github.sh
```

**如果提示需要输入用户名**，按照脚本提示操作。

### 方法二：手动推送

如果您的 GitHub 用户名不是 `szkking`，请手动运行：

```bash
cd /Users/szkking/video-smart-downloader

# 替换 YOUR_USERNAME 为您的实际用户名
git remote add origin https://github.com/YOUR_USERNAME/video-smart-downloader.git

# 推送代码
git push -u origin main

# 创建版本标签（触发自动构建）
git tag v1.0.0
git push origin v1.0.0
```

---

## 第七步：查看构建进度

1. 推送成功后，访问您的仓库页面
2. 点击顶部的 **"Actions"** 标签
3. 您会看到正在运行的构建任务：
   - `build-macos`：macOS 安装包构建
   - `build-windows`：Windows 安装包构建
4. 等待 **10-20 分钟**

---

## 第八步：下载安装包

构建完成后：

1. 点击仓库顶部的 **"Releases"** 或右侧的 **"Releases"** 链接
2. 点击 **v1.0.0** 版本
3. 在 **"Assets"** 区域下载：
   - `video-smart-downloader_1.0.0_universal.dmg` - macOS 安装包
   - `video-smart-downloader_1.0.0_x64-setup.exe` - Windows 安装包

---

## 🎉 完成！

现在您可以：
- 双击 `.dmg` 文件在 macOS 上安装
- 双击 `.exe` 文件在 Windows 上安装
- 分享 Release 页面链接给其他用户

---

## ❓ 常见问题

### Q: 如果 Actions 构建失败怎么办？

1. 点击失败的任务查看错误日志
2. 常见问题：
   - yt-dlp 下载失败 → 重新运行 workflow
   - 网络超时 → 重新运行 workflow
3. 重新运行：点击失败任务右上角的 **"Re-run jobs"**

### Q: 我的 GitHub 用户名是什么？

访问 https://github.com/settings/profile，查看 **Username** 字段。

### Q: 推送时提示需要 Personal Access Token？

GitHub 现在需要使用 Token 而不是密码：

1. 访问 https://github.com/settings/tokens
2. 点击 **"Generate new token (classic)"**
3. 勾选 `repo` 权限
4. 点击 **"Generate token"**
5. 复制 Token（只显示一次！）
6. 推送时使用 Token 作为密码

### Q: 能否修改仓库名称？

可以，在仓库设置中修改，但需要同步更新本地远程地址：

```bash
git remote set-url origin https://github.com/YOUR_USERNAME/新仓库名.git
```

---

**需要帮助？** 查看 GITHUB_SETUP.md 获取更多详细说明。
