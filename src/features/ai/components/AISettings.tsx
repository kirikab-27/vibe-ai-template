import { useState, useEffect } from 'react';
import { Save, RotateCcw, Info } from 'lucide-react';
import { useAIService } from '../hooks/useAIService';
import type { AISettings as AISettingsType } from '../types/ai';

// ローカルストレージのキー
const SETTINGS_KEY = 'ai-assistant-settings';

// デフォルト設定
const defaultSettings: AISettingsType = {
  preferredModel: 'sonnet',
  autoAnalysis: false,
  realTimeHelp: true,
  telemetryEnabled: false,
  offlineFallback: true,
  hotkeysEnabled: true
};

export function AISettings() {
  const [settings, setSettings] = useState<AISettingsType>(defaultSettings);
  const [hasChanges, setHasChanges] = useState(false);
  const { status, updateConfig } = useAIService();

  // 設定の読み込み
  useEffect(() => {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) {
      try {
        const parsedSettings = JSON.parse(saved);
        setSettings({ ...defaultSettings, ...parsedSettings });
      } catch (error) {
        console.warn('Failed to parse saved settings:', error);
      }
    }
  }, []);

  // 設定の変更検知
  useEffect(() => {
    const saved = localStorage.getItem(SETTINGS_KEY);
    const current = JSON.stringify(settings);
    const original = saved || JSON.stringify(defaultSettings);
    setHasChanges(current !== original);
  }, [settings]);

  const handleChange = (key: keyof AISettingsType, value: any) => {
    setSettings((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    
    // AIサービスの設定も更新
    updateConfig({
      preferredModel: settings.preferredModel,
      enableOfflineFallback: settings.offlineFallback
    });
    
    setHasChanges(false);
  };

  const handleReset = () => {
    setSettings(defaultSettings);
    localStorage.removeItem(SETTINGS_KEY);
    setHasChanges(false);
  };

  return (
    <div className="h-full flex flex-col p-4">
      <div className="flex-1 space-y-6">
        {/* AI モデル設定 */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900 flex items-center gap-2">
            <span>AI モデル</span>
            <Info size={14} className="text-gray-400" />
          </h4>
          <div className="space-y-2">
            {[
              { value: 'haiku', label: 'Claude Haiku', desc: '高速・軽量（日常使い）' },
              { value: 'sonnet', label: 'Claude Sonnet', desc: 'バランス型（推奨）' },
              { value: 'opus', label: 'Claude Opus', desc: '高性能・重い（複雑な処理）' }
            ].map((model) => (
              <label key={model.value} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                <input
                  type="radio"
                  name="model"
                  value={model.value}
                  checked={settings.preferredModel === model.value}
                  onChange={(e) => handleChange('preferredModel', e.target.value)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <div className="flex-1">
                  <div className="font-medium text-sm">{model.label}</div>
                  <div className="text-xs text-gray-500">{model.desc}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* 動作設定 */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">動作設定</h4>
          <div className="space-y-3">
            <ToggleSwitch
              label="自動コード分析"
              description="ファイル保存時に自動でコードを分析"
              checked={settings.autoAnalysis}
              onChange={(checked) => handleChange('autoAnalysis', checked)}
            />
            
            <ToggleSwitch
              label="リアルタイムヘルプ"
              description="入力中にリアルタイムで提案を表示"
              checked={settings.realTimeHelp}
              onChange={(checked) => handleChange('realTimeHelp', checked)}
            />
            
            <ToggleSwitch
              label="オフライン機能"
              description="ネットワーク切断時にローカル分析を使用"
              checked={settings.offlineFallback}
              onChange={(checked) => handleChange('offlineFallback', checked)}
            />
            
            <ToggleSwitch
              label="キーボードショートカット"
              description="Cmd+K でAIアシスタントを起動"
              checked={settings.hotkeysEnabled}
              onChange={(checked) => handleChange('hotkeysEnabled', checked)}
            />
          </div>
        </div>

        {/* プライバシー設定 */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">プライバシー</h4>
          <ToggleSwitch
            label="使用統計の収集"
            description="機能改善のため使用状況を匿名で収集（オプション）"
            checked={settings.telemetryEnabled}
            onChange={(checked) => handleChange('telemetryEnabled', checked)}
          />
        </div>

        {/* ステータス情報 */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">システム情報</h4>
          <div className="bg-gray-50 p-3 rounded-lg space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">接続状態:</span>
              <span className={status.isOnline ? 'text-green-600' : 'text-red-600'}>
                {status.isOnline ? '🟢 オンライン' : '🔴 オフライン'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">成功回数:</span>
              <span className="text-gray-900">{status.successCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">エラー回数:</span>
              <span className="text-gray-900">{status.errorCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">最終チェック:</span>
              <span className="text-gray-900">
                {new Date(status.lastHealthCheck).toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 操作ボタン */}
      <div className="flex gap-2 pt-4 border-t">
        <button
          onClick={handleSave}
          disabled={!hasChanges}
          className={`
            flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium text-sm
            transition-colors
            ${hasChanges
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          <Save size={16} />
          保存
        </button>
        
        <button
          onClick={handleReset}
          className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <RotateCcw size={16} />
        </button>
      </div>
    </div>
  );
}

// トグルスイッチコンポーネント
interface ToggleSwitchProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function ToggleSwitch({ label, description, checked, onChange }: ToggleSwitchProps) {
  return (
    <label className="flex items-start gap-3 cursor-pointer">
      <div className="flex-1">
        <div className="font-medium text-sm text-gray-900">{label}</div>
        {description && (
          <div className="text-xs text-gray-500 mt-1">{description}</div>
        )}
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`
          relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          ${checked ? 'bg-blue-600' : 'bg-gray-300'}
        `}
      >
        <span
          className={`
            inline-block h-3 w-3 transform rounded-full bg-white transition-transform
            ${checked ? 'translate-x-5' : 'translate-x-1'}
          `}
        />
      </button>
    </label>
  );
} 