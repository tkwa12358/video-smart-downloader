# Windows 二进制文件下载脚本

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  视频智能下载器 - 二进制文件下载脚本 (Windows)" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# 创建 binaries 目录
New-Item -ItemType Directory -Force -Path "src-tauri\binaries" | Out-Null

# 下载 yt-dlp
Write-Host "[1/2] 下载 yt-dlp..." -ForegroundColor Yellow
Invoke-WebRequest -Uri "https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp.exe" `
    -OutFile "src-tauri\binaries\yt-dlp.exe"
Write-Host "✓ yt-dlp 下载完成" -ForegroundColor Green

# 下载 ffmpeg
Write-Host ""
Write-Host "[2/2] 下载 ffmpeg..." -ForegroundColor Yellow
Write-Host "提示：ffmpeg 较大（约 100MB），请耐心等待..." -ForegroundColor Gray

# 下载 ffmpeg essentials
$ffmpegUrl = "https://www.gyan.dev/ffmpeg/builds/ffmpeg-release-essentials.zip"
$ffmpegZip = "ffmpeg-temp.zip"
$ffmpegExtract = "ffmpeg-temp"

Invoke-WebRequest -Uri $ffmpegUrl -OutFile $ffmpegZip

# 解压
Expand-Archive -Path $ffmpegZip -DestinationPath $ffmpegExtract -Force

# 查找并复制 ffmpeg.exe
$ffmpegExe = Get-ChildItem -Path $ffmpegExtract -Recurse -Filter "ffmpeg.exe" | Select-Object -First 1
if ($ffmpegExe) {
    Copy-Item -Path $ffmpegExe.FullName -Destination "src-tauri\binaries\ffmpeg.exe"
    Write-Host "✓ ffmpeg 下载并解压完成" -ForegroundColor Green
} else {
    Write-Host "❌ 未找到 ffmpeg.exe" -ForegroundColor Red
    exit 1
}

# 清理临时文件
Remove-Item -Path $ffmpegZip -Force
Remove-Item -Path $ffmpegExtract -Recurse -Force

# 验证文件
Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "验证二进制文件..." -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan

Get-ChildItem -Path "src-tauri\binaries" | Format-Table Name, Length, LastWriteTime

Write-Host ""
Write-Host "✓ 所有二进制文件准备完成！" -ForegroundColor Green
Write-Host ""
Write-Host "现在可以运行以下命令构建应用：" -ForegroundColor Yellow
Write-Host "  npm run tauri:build:windows" -ForegroundColor White
Write-Host ""
