# Windows 构建脚本

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  视频智能下载器 - Windows 构建脚本" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# 检查 Rust 工具链
Write-Host "[1/4] 检查 Rust 工具链..." -ForegroundColor Yellow
if (-not (Get-Command rustc -ErrorAction SilentlyContinue)) {
    Write-Host "❌ 未安装 Rust，请先访问：https://rustup.rs/" -ForegroundColor Red
    exit 1
}
$rustVersion = rustc --version
Write-Host "✓ Rust 已安装: $rustVersion" -ForegroundColor Green

# 检查二进制文件
Write-Host ""
Write-Host "[2/4] 检查二进制文件..." -ForegroundColor Yellow
if (-not (Test-Path "src-tauri\binaries\yt-dlp.exe")) {
    Write-Host "❌ 找不到 yt-dlp.exe，请先运行：" -ForegroundColor Red
    Write-Host "  .\scripts\download-binaries.ps1" -ForegroundColor White
    exit 1
}
if (-not (Test-Path "src-tauri\binaries\ffmpeg.exe")) {
    Write-Host "❌ 找不到 ffmpeg.exe，请先运行：" -ForegroundColor Red
    Write-Host "  .\scripts\download-binaries.ps1" -ForegroundColor White
    exit 1
}
Write-Host "✓ 二进制文件已就绪" -ForegroundColor Green

# 安装前端依赖
Write-Host ""
Write-Host "[3/4] 安装前端依赖..." -ForegroundColor Yellow
npm install
Write-Host "✓ 依赖安装完成" -ForegroundColor Green

# 构建应用
Write-Host ""
Write-Host "[4/4] 构建 Windows 安装包..." -ForegroundColor Yellow
Write-Host ""
npm run tauri:build:windows

# 完成
Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "✓ 构建完成！" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "安装包位置：" -ForegroundColor Yellow
Write-Host "  src-tauri\target\release\bundle\nsis\video-smart-downloader_1.0.0_x64-setup.exe" -ForegroundColor White
Write-Host ""

# 显示文件大小
$installer = Get-Item "src-tauri\target\release\bundle\nsis\*.exe" -ErrorAction SilentlyContinue
if ($installer) {
    Write-Host "文件大小：" -ForegroundColor Yellow
    $installer | Format-Table Name, @{Name="Size (MB)"; Expression={[math]::Round($_.Length/1MB, 2)}}
}
Write-Host ""
