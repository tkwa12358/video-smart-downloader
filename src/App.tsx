import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import { Download, Settings, CheckCircle, AlertCircle, Loader2, Globe, Shield } from 'lucide-react';

interface VideoInfo {
  title: string;
  thumbnail: string;
  formats: Array<{
    format_id: string;
    resolution: string;
    filesize: number;
    ext: string;
  }>;
}

interface ProxyStatus {
  has_proxy: boolean;
  can_access_youtube: boolean;
  message: string;
}

interface DownloadProgress {
  status: string;
  percent: number;
  speed: string;
  eta: string;
}

function App() {
  const [url, setUrl] = useState('');
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [selectedQuality, setSelectedQuality] = useState('');
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState<DownloadProgress | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [autoUpdate, setAutoUpdate] = useState(false);
  const [proxyStatus, setProxyStatus] = useState<ProxyStatus | null>(null);
  const [checkingProxy, setCheckingProxy] = useState(false);

  // 检测代理和网络环境
  const checkProxyStatus = async () => {
    setCheckingProxy(true);
    try {
      const status: ProxyStatus = await invoke('check_proxy_status');
      setProxyStatus(status);

      if (!status.can_access_youtube && !status.has_proxy) {
        setError('检测到无法访问 YouTube。请检查网络连接或启用系统代理。');
      } else if (status.has_proxy) {
        setSuccess('已自动检测到系统代理，将使用代理下载。');
      }
    } catch (err) {
      console.error('检测代理失败:', err);
    } finally {
      setCheckingProxy(false);
    }
  };

  useEffect(() => {
    checkProxyStatus();
    loadSettings();
  }, []);

  // 加载设置
  const loadSettings = async () => {
    try {
      const settings: any = await invoke('load_settings');
      setAutoUpdate(settings.auto_update || false);
    } catch (err) {
      console.error('加载设置失败:', err);
    }
  };

  // 保存设置
  const saveSettings = async () => {
    try {
      await invoke('save_settings', { autoUpdate });
      setSuccess('设置已保存');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('保存设置失败');
    }
  };

  // 解析视频信息
  const parseVideo = async () => {
    if (!url.trim()) {
      setError('请输入视频链接');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    setVideoInfo(null);

    try {
      const info: VideoInfo = await invoke('parse_video', { url });
      setVideoInfo(info);

      // 默认选择最高清晰度
      if (info.formats && info.formats.length > 0) {
        setSelectedQuality(info.formats[0].format_id);
      } else {
        setError('未找到可用的视频格式');
      }
    } catch (err: any) {
      setError(err.toString() || '解析失败，请检查链接是否正确');
    } finally {
      setLoading(false);
    }
  };

  // 下载视频
  const downloadVideo = async () => {
    if (!selectedQuality || !videoInfo) {
      setError('请选择清晰度');
      return;
    }

    setDownloading(true);
    setError('');
    setProgress({ status: '准备下载...', percent: 0, speed: '', eta: '' });

    try {
      await invoke('download_video', {
        url,
        formatId: selectedQuality,
        title: videoInfo.title
      });

      setSuccess('下载完成！');
      setDownloading(false);
      setProgress(null);
      setVideoInfo(null);
      setUrl('');
    } catch (err: any) {
      setError(err.toString() || '下载失败');
      setDownloading(false);
      setProgress(null);
    }
  };


  // 手动更新 yt-dlp
  const updateYtDlp = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await invoke('update_ytdlp');
      setSuccess('yt-dlp 更新成功！');
    } catch (err: any) {
      setError('更新失败: ' + err.toString());
    } finally {
      setLoading(false);
    }
  };

  // 格式化文件大小
  const formatFileSize = (bytes: number): string => {
    if (!bytes) return '未知';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  };


  return (
    <div className="min-h-screen bg-dark-bg text-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* 头部 */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Download className="w-8 h-8 text-blue-accent" />
            <h1 className="text-3xl font-bold">视频智能下载器</h1>
          </div>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-lg bg-dark-surface hover:bg-dark-border transition-colors"
          >
            <Settings className="w-6 h-6" />
          </button>
        </div>

        {/* 代理状态提示 */}
        {proxyStatus && (
          <div className={`mb-4 p-4 rounded-lg flex items-center gap-3 ${
            proxyStatus.can_access_youtube ? 'bg-green-900/20 border border-green-700' : 'bg-yellow-900/20 border border-yellow-700'
          }`}>
            {proxyStatus.has_proxy ? (
              <Shield className="w-5 h-5 text-green-400" />
            ) : (
              <Globe className="w-5 h-5 text-yellow-400" />
            )}
            <span className="text-sm">{proxyStatus.message}</span>
            <button
              onClick={checkProxyStatus}
              disabled={checkingProxy}
              className="ml-auto text-xs px-3 py-1 bg-blue-accent hover:bg-blue-hover rounded transition-colors disabled:opacity-50"
            >
              {checkingProxy ? '检测中...' : '重新检测'}
            </button>
          </div>
        )}

        {/* 设置面板 */}
        {showSettings && (
          <div className="mb-6 p-6 rounded-lg bg-dark-surface border border-dark-border">
            <h2 className="text-xl font-semibold mb-4">设置</h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm">自动更新 yt-dlp</label>
                <input
                  type="checkbox"
                  checked={autoUpdate}
                  onChange={(e) => setAutoUpdate(e.target.checked)}
                  className="w-5 h-5"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={saveSettings}
                  className="px-4 py-2 bg-blue-accent hover:bg-blue-hover rounded-lg transition-colors"
                >
                  保存设置
                </button>

                <button
                  onClick={updateYtDlp}
                  disabled={loading}
                  className="px-4 py-2 bg-dark-border hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
                >
                  {loading ? '更新中...' : '手动更新 yt-dlp'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 主输入框 */}
        <div className="bg-dark-surface rounded-lg border border-dark-border p-6 mb-6">
          <div className="flex gap-3">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && parseVideo()}
              placeholder="粘贴视频链接（支持 YouTube、TikTok、Bilibili、抖音等）"
              className="flex-1 px-4 py-3 bg-dark-bg border border-dark-border rounded-lg focus:outline-none focus:border-blue-accent"
              disabled={loading || downloading}
            />
            <button
              onClick={parseVideo}
              disabled={loading || downloading}
              className="px-6 py-3 bg-blue-accent hover:bg-blue-hover rounded-lg font-semibold transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  解析中...
                </>
              ) : (
                '解析'
              )}
            </button>
          </div>
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-700 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <span className="text-red-200">{error}</span>
          </div>
        )}

        {/* 成功提示 */}
        {success && (
          <div className="mb-6 p-4 bg-green-900/20 border border-green-700 rounded-lg flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="text-green-200">{success}</span>
          </div>
        )}

        {/* 视频信息 */}
        {videoInfo && (
          <div className="bg-dark-surface rounded-lg border border-dark-border p-6 mb-6">
            <h3 className="text-xl font-semibold mb-4">{videoInfo.title}</h3>

            {videoInfo.thumbnail && (
              <img
                src={videoInfo.thumbnail}
                alt="视频缩略图"
                className="w-full max-w-md rounded-lg mb-4"
              />
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">选择清晰度：</label>
              <select
                value={selectedQuality}
                onChange={(e) => setSelectedQuality(e.target.value)}
                className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg focus:outline-none focus:border-blue-accent"
              >
                {(videoInfo.formats || []).map((format) => (
                  <option key={format.format_id} value={format.format_id}>
                    {format.resolution} - {formatFileSize(format.filesize)} ({format.ext})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={downloadVideo}
              disabled={downloading}
              className="w-full px-6 py-3 bg-blue-accent hover:bg-blue-hover rounded-lg font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {downloading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  下载中...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  开始下载
                </>
              )}
            </button>
          </div>
        )}

        {/* 下载进度 */}
        {progress && (
          <div className="bg-dark-surface rounded-lg border border-dark-border p-6">
            <div className="mb-2 flex justify-between text-sm">
              <span>{progress.status}</span>
              <span>{progress.percent}%</span>
            </div>
            <div className="w-full bg-dark-bg rounded-full h-2 mb-3">
              <div
                className="bg-blue-accent h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress.percent}%` }}
              ></div>
            </div>
            {progress.speed && (
              <div className="text-sm text-gray-400">
                速度: {progress.speed} | 预计剩余: {progress.eta}
              </div>
            )}
          </div>
        )}

        {/* 支持的平台说明 */}
        <div className="mt-8 p-4 bg-dark-surface/50 rounded-lg border border-dark-border/50">
          <h4 className="text-sm font-semibold mb-2">支持的平台</h4>
          <p className="text-xs text-gray-400">
            YouTube, TikTok, Twitter/X, Bilibili, 抖音, 视频号, Instagram, Vimeo,
            Facebook, 小红书 等 1000+ 平台
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
