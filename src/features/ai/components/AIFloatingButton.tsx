import { motion } from 'framer-motion';
import { Bot, MessageCircle } from 'lucide-react';

interface AIFloatingButtonProps {
  onClick: () => void;
  isOpen: boolean;
  isOnline: boolean;
}

export function AIFloatingButton({ onClick, isOpen, isOnline }: AIFloatingButtonProps) {
  return (
    <motion.button
      className={`
        fixed bottom-6 right-6 z-50
        w-14 h-14 rounded-full shadow-lg
        flex items-center justify-center
        transition-all duration-200
        ${isOnline 
          ? 'bg-blue-600 hover:bg-blue-700 text-white' 
          : 'bg-gray-400 text-gray-200'
        }
        ${isOpen ? 'bg-blue-700' : ''}
      `}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ 
        type: "spring", 
        stiffness: 260, 
        damping: 20 
      }}
    >
      <motion.div
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.2 }}
      >
        {isOnline ? (
          <Bot size={24} />
        ) : (
          <MessageCircle size={24} />
        )}
      </motion.div>
      
      {/* オンライン状態インジケーター */}
      <div 
        className={`
          absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white
          ${isOnline ? 'bg-green-500' : 'bg-red-500'}
        `}
      />
      
      {/* ツールチップ */}
      <div 
        className={`
          absolute bottom-16 right-0 px-3 py-2 
          bg-gray-900 text-white text-sm rounded-lg
          whitespace-nowrap opacity-0 pointer-events-none
          transition-opacity duration-200
          hover:opacity-100
        `}
      >
        AI Assistant {isOnline ? '(オンライン)' : '(オフライン)'}
      </div>
    </motion.button>
  );
} 