import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Code, MessageSquare, Settings, Zap } from 'lucide-react';
import { CodeAnalyzer } from './CodeAnalyzer';
import { ChatInterface } from './ChatInterface';
import { AISettings } from './AISettings';

interface AIPanelProps {
  isOpen: boolean;
  onClose: () => void;
  isOnline: boolean;
}

type TabType = 'chat' | 'analyze' | 'settings';

export function AIPanel({ isOpen, onClose, isOnline }: AIPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>('chat');

  const tabs = [
    { id: 'chat', label: 'チャット', icon: MessageSquare },
    { id: 'analyze', label: '分析', icon: Code },
    { id: 'settings', label: '設定', icon: Settings },
  ] as const;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* オーバーレイ */}
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-20 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* パネル */}
          <motion.div
            className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-xl shadow-2xl z-50 flex flex-col overflow-hidden"
            initial={{ scale: 0, opacity: 0, originX: 1, originY: 1 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* ヘッダー */}
            <div className="flex items-center justify-between p-4 border-b bg-gray-50">
              <div className="flex items-center gap-2">
                <Zap className="text-blue-600" size={20} />
                <h3 className="font-semibold text-gray-900">AI Assistant</h3>
                <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
              </div>
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* タブ */}
            <div className="flex border-b">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium
                      transition-colors relative
                      ${activeTab === tab.id
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }
                    `}
                  >
                    <Icon size={16} />
                    {tab.label}
                    {activeTab === tab.id && (
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                        layoutId="activeTab"
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* コンテンツエリア */}
            <div className="flex-1 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  className="h-full"
                >
                  {activeTab === 'chat' && <ChatInterface isOnline={isOnline} />}
                  {activeTab === 'analyze' && <CodeAnalyzer isOnline={isOnline} />}
                  {activeTab === 'settings' && <AISettings />}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* ステータスバー */}
            <div className="px-4 py-2 bg-gray-50 border-t">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>
                  {isOnline ? '🟢 Claude Code 接続中' : '🔴 オフラインモード'}
                </span>
                <span>v1.0.0</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
} 