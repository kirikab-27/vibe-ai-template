import { useState } from 'react';
import { AIFloatingButton } from './AIFloatingButton';
import { AIPanel } from './AIPanel';
import { useAIService } from '../../hooks/ai/useAIService';
import { useAIHotkeys } from '../../hooks/ai/useHotkeys';
import { useFileContext } from '../../hooks/ai/useFileContext';

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'analyze' | 'knowledge' | 'settings'>('chat');
  const { isOnline } = useAIService();
  const { fileContext } = useFileContext();

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleFocusChat = () => {
    setIsOpen(true);
    setActiveTab('chat');
    // 少し遅延してからフォーカス
    setTimeout(() => {
      const chatInput = document.querySelector('[data-chat-input]') as HTMLElement;
      if (chatInput) {
        chatInput.focus();
      }
    }, 100);
  };

  const handleFocusAnalyzer = () => {
    setIsOpen(true);
    setActiveTab('analyze');
    // 少し遅延してからフォーカス
    setTimeout(() => {
      const analyzerInput = document.querySelector('[data-analyzer-input]') as HTMLElement;
      if (analyzerInput) {
        analyzerInput.focus();
      }
    }, 100);
  };

  // ホットキーの設定
  useAIHotkeys({
    onToggleAI: handleToggle,
    onFocusChat: handleFocusChat,
    onFocusAnalyzer: handleFocusAnalyzer,
    enabled: true
  });

  return (
    <>
      <AIFloatingButton 
        onClick={handleToggle}
        isOpen={isOpen}
        isOnline={isOnline}
      />
      
      <AIPanel 
        isOpen={isOpen}
        onClose={handleClose}
        isOnline={isOnline}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        fileContext={fileContext}
      />
    </>
  );
} 