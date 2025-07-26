import { useState, useCallback, useEffect } from 'react';
import { aiService } from '../services/aiService';
import type { AIAnalysisResult, AIServiceStatus } from '../types/ai';

export interface UseAIServiceOptions {
  autoHealthCheck?: boolean;
  healthCheckInterval?: number;
}

export function useAIService(options: UseAIServiceOptions = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<AIServiceStatus>(aiService.getStatus());
  const [error, setError] = useState<string | null>(null);

  const { autoHealthCheck = true, healthCheckInterval = 30000 } = options;

  // ヘルスチェック
  useEffect(() => {
    if (!autoHealthCheck) return;

    const checkHealth = async () => {
      try {
        const newStatus = aiService.getStatus();
        setStatus(newStatus);
      } catch (err) {
        console.warn('Health check failed:', err);
      }
    };

    // 初回チェック
    checkHealth();

    // 定期的なヘルスチェック
    const interval = setInterval(checkHealth, healthCheckInterval);

    return () => clearInterval(interval);
  }, [autoHealthCheck, healthCheckInterval]);

  const analyzeCode = useCallback(async (code: string, context?: string): Promise<AIAnalysisResult | null> => {
    if (!code.trim()) {
      setError('分析するコードが入力されていません');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await aiService.analyzeCode(code, context);
      // 成功後にステータスを更新
      setStatus(aiService.getStatus());
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '分析中にエラーが発生しました';
      setError(errorMessage);
      setStatus(aiService.getStatus());
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const generateCode = useCallback(async (prompt: string): Promise<string | null> => {
    if (!prompt.trim()) {
      setError('プロンプトが入力されていません');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await aiService.generateCode(prompt);
      setStatus(aiService.getStatus());
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'コード生成中にエラーが発生しました';
      setError(errorMessage);
      setStatus(aiService.getStatus());
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const updateConfig = useCallback((config: Partial<AIServiceStatus['config']>) => {
    aiService.updateConfig(config);
    setStatus(aiService.getStatus());
  }, []);

  return {
    // Actions
    analyzeCode,
    generateCode,
    clearError,
    updateConfig,
    
    // State
    isLoading,
    error,
    status,
    
    // Computed values for convenience
    isOnline: status.isOnline,
    config: status.config,
    
    // Raw service access
    aiService
  };
} 