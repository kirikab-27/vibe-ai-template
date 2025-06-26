import React, { useState } from 'react';
import { AIFloatingButton } from './AIFloatingButton';
import { AIPanel } from './AIPanel';
import { useAIService } from '../../hooks/ai/useAIService';

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const { isOnline } = useAIService();

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

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
      />
    </>
  );
} 