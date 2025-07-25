import { useEffect, useCallback } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

interface UseHotkeysProps {
  onToggleAI: () => void;
  onFocusChat: () => void;
  onFocusAnalyzer: () => void;
  enabled?: boolean;
}

export function useAIHotkeys({ 
  onToggleAI, 
  onFocusChat, 
  onFocusAnalyzer, 
  enabled = true 
}: UseHotkeysProps) {
  
  // メインAIアシスタント起動 (Cmd+K / Ctrl+K)
  useHotkeys(
    'mod+k',
    (event) => {
      event.preventDefault();
      onToggleAI();
    },
    { enabled, enableOnFormTags: true }
  );

  // チャットフォーカス (Cmd+Shift+C)
  useHotkeys(
    'mod+shift+c',
    (event) => {
      event.preventDefault();
      onFocusChat();
    },
    { enabled, enableOnFormTags: true }
  );

  // コード分析フォーカス (Cmd+Shift+A)
  useHotkeys(
    'mod+shift+a',
    (event) => {
      event.preventDefault();
      onFocusAnalyzer();
    },
    { enabled, enableOnFormTags: true }
  );

  // Escキーでパネルを閉じる
  useHotkeys(
    'escape',
    (event) => {
      event.preventDefault();
      // パネルが開いている場合のみ閉じる
      const aiPanel = document.querySelector('[data-ai-panel]');
      if (aiPanel) {
        onToggleAI();
      }
    },
    { enabled, enableOnFormTags: true }
  );

  // ヘルプ表示 (Cmd+?)
  useHotkeys(
    'mod+shift+slash',
    (event) => {
      event.preventDefault();
      showHotkeyHelp();
    },
    { enabled }
  );

  const showHotkeyHelp = useCallback(() => {
    const helpMessage = `
🔥 AI Assistant ホットキー:
• Cmd/Ctrl + K: AIアシスタント起動
• Cmd/Ctrl + Shift + C: チャットフォーカス
• Cmd/Ctrl + Shift + A: コード分析フォーカス
• Escape: パネルを閉じる
• Cmd/Ctrl + ?: このヘルプを表示
    `;
    
    // トーストまたはモーダルでヘルプを表示
    console.log(helpMessage);
    
    // 簡易的なアラート（後でよりUIに統合予定）
    if (window.confirm('AI Assistant ホットキーヘルプを表示しますか？')) {
      alert(helpMessage);
    }
  }, []);

  // クリーンアップと初期化
  useEffect(() => {
    if (enabled) {
      console.log('🔥 AI Assistant ホットキーが有効になりました');
      console.log('Cmd/Ctrl + K でAIアシスタントを起動できます');
    }
  }, [enabled]);

  return {
    showHotkeyHelp
  };
} 