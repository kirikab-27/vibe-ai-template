import { useState } from 'react';
import { AIFloatingButton } from './AIFloatingButton';
import AIPanel from './AIPanel';
import { useAIService } from '../hooks/useAIService';

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('chat');
  const { isOnline } = useAIService();

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  // const handleTabChange = (tab: string) => {
  //   setActiveTab(tab);
  //   if (!isOpen) {
  //     setIsOpen(true);
  //   }
  // };

  // Phase 3: ホットキー対応は一時的にコメントアウト
  /*
  useAIHotkeys({
    'ctrl+k, cmd+k': () => handleToggle(),
    'ctrl+shift+c, cmd+shift+c': () => handleTabChange('chat'),
    'ctrl+shift+a, cmd+shift+a': () => handleTabChange('analysis'),
    'escape': () => setIsOpen(false),
  });
  */

  return (
    <>
      <AIFloatingButton 
        onClick={handleToggle}
        isOpen={isOpen}
        isOnline={isOnline}
      />
      
      <AIPanel
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        activeTab={activeTab}
      />
    </>
  );
} 