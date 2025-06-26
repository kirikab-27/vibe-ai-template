import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, User, Bot, Sparkles } from 'lucide-react';
import { useAIService } from '../../hooks/ai/useAIService';
import type { ChatMessage } from '../../types/ai';

interface ChatInterfaceProps {
  isOnline: boolean;
}

export function ChatInterface({ isOnline }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'こんにちは！AI Assistantです。コード生成やプログラミングに関する質問にお答えします。何かお手伝いできることはありますか？',
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const { generateCode, isLoading } = useAIService();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 自動スクロール
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // AI応答のシミュレーション
    const response = await generateCode(input);
    
    const assistantMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      type: 'assistant',
      content: response || 'エラーが発生しました。もう一度お試しください。',
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, assistantMessage]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const presetPrompts = [
    'React コンポーネントを作成して',
    'TypeScript の型定義を教えて',
    'API エンドポイントの例を見せて',
    'エラーハンドリングのベストプラクティス'
  ];

  return (
    <div className="h-full flex flex-col">
      {/* メッセージエリア */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.type === 'assistant' && (
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot size={16} className="text-white" />
              </div>
            )}
            
            <div className={`
              max-w-[80%] rounded-lg p-3 
              ${message.type === 'user' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-900'
              }
            `}>
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              <p className="text-xs mt-1 opacity-70">
                {new Date(message.timestamp).toLocaleTimeString()}
              </p>
            </div>

            {message.type === 'user' && (
              <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                <User size={16} className="text-white" />
              </div>
            )}
          </motion.div>
        ))}

        {/* ローディング表示 */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3 justify-start"
          >
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <Bot size={16} className="text-white" />
            </div>
            <div className="bg-gray-100 rounded-lg p-3">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* プリセットプロンプト */}
      {messages.length === 1 && (
        <div className="px-4 pb-2">
          <p className="text-xs text-gray-500 mb-2">よく使われる質問:</p>
          <div className="grid grid-cols-1 gap-2">
            {presetPrompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => setInput(prompt)}
                className="text-left p-2 text-xs bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-blue-700"
              >
                <Sparkles size={12} className="inline mr-1" />
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 入力エリア */}
      <div className="p-4 border-t bg-gray-50">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isOnline ? "メッセージを入力..." : "オフラインモード - 基本的な応答のみ利用可能"}
            disabled={isLoading}
            className="flex-1 resize-none border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            rows={1}
            style={{ minHeight: '38px', maxHeight: '120px' }}
            data-chat-input
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={`
              px-3 py-2 rounded-lg transition-colors flex items-center justify-center
              ${!input.trim() || isLoading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
              }
            `}
          >
            <Send size={16} />
          </button>
        </div>
        
        <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
          <span>Enter で送信、Shift+Enter で改行</span>
          <span>{isOnline ? '🟢' : '🔴'} {isOnline ? 'オンライン' : 'オフライン'}</span>
        </div>
      </div>
    </div>
  );
} 