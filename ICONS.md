# 图标准备指南

Tauri 应用需要多种尺寸和格式的图标文件。

## 📋 所需图标

### 必需文件

在 `src-tauri/icons/` 目录下需要以下文件：

```
src-tauri/icons/
├── 32x32.png           # Windows 系统托盘
├── 128x128.png         # macOS 标准尺寸
├── 128x128@2x.png      # macOS Retina 显示
├── icon.icns           # macOS 应用图标（包含多种尺寸）
└── icon.ico            # Windows 应用图标（包含多种尺寸）
```

---

## 🎨 准备源图标

### 1. 创建高分辨率源图

**要求**：
- 尺寸：至少 1024x1024 像素
- 格式：PNG，透明背景
- 设计：简洁、清晰、可识别

**推荐工具**：
- Figma (在线设计)
- Adobe Illustrator
- Inkscape (免费)
- Canva (在线)

### 2. 示例设计思路

**视频下载器图标建议**：
- 主元素：下载箭头 + 播放按钮
- 颜色：蓝色系（与暗色主题搭配）
- 风格：现代、扁平化

---

## 🛠️ 生成所有尺寸

### 方法一：在线工具（推荐）

访问 [Tauri Icon Generator](https://icon-generator.vercel.app/)

1. 上传 1024x1024 PNG
2. 点击生成
3. 下载 ZIP 包
4. 解压到 `src-tauri/icons/`

### 方法二：使用 ImageMagick

#### 安装 ImageMagick

**macOS**:
```bash
brew install imagemagick
```

**Windows**:
下载安装包：https://imagemagick.org/script/download.php

#### 生成图标

```bash
# 进入项目目录
cd video-smart-downloader

# 假设你有 icon-1024.png（1024x1024）

# 生成 PNG 文件
convert icon-1024.png -resize 32x32 src-tauri/icons/32x32.png
convert icon-1024.png -resize 128x128 src-tauri/icons/128x128.png
convert icon-1024.png -resize 256x256 src-tauri/icons/128x128@2x.png

# 生成 Windows .ico（包含多种尺寸）
convert icon-1024.png \
  -define icon:auto-resize=256,128,64,48,32,16 \
  src-tauri/icons/icon.ico

# 生成 macOS .icns
# macOS 需要额外工具
```

### 方法三：使用 png2icns (macOS)

```bash
# 安装 png2icns
brew install png2icns

# 生成 .icns
png2icns src-tauri/icons/icon.icns icon-1024.png
```

---

## ✅ 验证图标

### 检查文件

```bash
ls -lh src-tauri/icons/

# 应该看到：
# 32x32.png
# 128x128.png
# 128x128@2x.png
# icon.icns
# icon.ico
```

### 测试图标

**macOS**:
```bash
# 预览 .icns
open src-tauri/icons/icon.icns
```

**Windows**:
双击 `icon.ico` 查看所有尺寸。

---

## 🎯 快速临时方案

如果你只是想快速测试，可以使用占位图标：

```bash
# 创建纯色占位图标（需要 ImageMagick）
convert -size 1024x1024 xc:#3b82f6 \
  -font Arial -pointsize 200 -fill white \
  -gravity center -annotate +0+0 "VD" \
  temp-icon.png

# 然后使用方法二生成所有尺寸
```

---

## 📐 图标设计规范

### Windows .ico 包含的尺寸

- 16x16
- 32x32
- 48x48
- 64x64
- 128x128
- 256x256

### macOS .icns 包含的尺寸

- 16x16 (icon_16x16.png)
- 32x32 (icon_16x16@2x.png)
- 32x32 (icon_32x32.png)
- 64x64 (icon_32x32@2x.png)
- 128x128 (icon_128x128.png)
- 256x256 (icon_128x128@2x.png)
- 256x256 (icon_256x256.png)
- 512x512 (icon_256x256@2x.png)
- 512x512 (icon_512x512.png)
- 1024x1024 (icon_512x512@2x.png)

---

## 🚨 常见错误

### 错误 1: "图标文件不存在"

```
Error: Icon file not found: src-tauri/icons/icon.ico
```

**解决**：确保所有图标文件都存在于 `src-tauri/icons/` 目录。

### 错误 2: "图标格式不正确"

```
Error: Invalid icon format
```

**解决**：
- 使用 PNG 格式（不是 JPG）
- 确保图标有透明背景
- 重新生成 .ico 和 .icns

### 错误 3: macOS 图标显示为通用图标

**原因**：.icns 文件损坏或格式不正确

**解决**：使用 `png2icns` 重新生成。

---

## 🎨 示例图标资源

如果需要临时图标，可以使用这些免费资源：

- [Flaticon](https://www.flaticon.com/) - 免费图标库
- [Icons8](https://icons8.com/) - 免费图标（需注明出处）
- [Heroicons](https://heroicons.com/) - MIT 许可图标
- [Lucide Icons](https://lucide.dev/) - 开源图标库

搜索关键词：
- "download icon"
- "video icon"
- "play icon"
- "arrow down icon"

---

## ✨ 最佳实践

1. **保持简洁**：图标在小尺寸下仍需清晰可辨
2. **避免细节过多**：16x16 时细节会丢失
3. **使用高对比度**：确保在亮色和暗色背景下都清晰
4. **测试所有尺寸**：在不同平台和尺寸下预览
5. **版本控制**：保存 SVG 源文件便于修改

---

## 🔧 完整示例流程

```bash
# 1. 准备 1024x1024 源图标
# （使用设计工具创建，保存为 icon-source.png）

# 2. 创建图标目录
mkdir -p src-tauri/icons

# 3. 生成 PNG 尺寸
convert icon-source.png -resize 32x32 src-tauri/icons/32x32.png
convert icon-source.png -resize 128x128 src-tauri/icons/128x128.png
convert icon-source.png -resize 256x256 src-tauri/icons/128x128@2x.png

# 4. 生成 .ico (Windows)
convert icon-source.png \
  -define icon:auto-resize=256,128,64,48,32,16 \
  src-tauri/icons/icon.ico

# 5. 生成 .icns (macOS)
png2icns src-tauri/icons/icon.icns icon-source.png

# 6. 验证
ls -lh src-tauri/icons/

# 7. 构建应用测试图标
npm run tauri:dev
```

---

**现在你可以继续构建应用了！** 🎉
