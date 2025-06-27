// AI機能の共通型定義

export interface AIServiceConfig {
  timeout: number;
  retryAttempts: number;
  preferredModel: 'sonnet' | 'opus' | 'haiku';
  enableOfflineFallback: boolean;
}

export interface AIAnalysisResult {
  codeQuality: 'high' | 'medium' | 'low';
  potentialIssues: string[];
  suggestions: string[];
  explanation?: string;
  confidence: number;
  source: 'claude' | 'claude-code-sdk' | 'local_knowledge' | 'fallback';
  timestamp: number;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  metadata?: {
    model?: string;
    tokens?: number;
    cost?: number;
  };
}

export interface KnowledgeEntry {
  id: string;
  title: string;
  content: string;
  tags: string[];
  type: 'problem' | 'solution' | 'pattern' | 'decision';
  confidence: 'high' | 'medium' | 'low';
  lastUpdated: number;
}

export interface AIFeatureFlags {
  aiChat: boolean;
  aiAnalysis: boolean;
  aiRefactor: boolean;
  autoAnalysis: boolean;
  realTimeHelp: boolean;
}

export interface AISettings {
  preferredModel: 'sonnet' | 'opus' | 'haiku';
  autoAnalysis: boolean;
  realTimeHelp: boolean;
  telemetryEnabled: boolean;
  offlineFallback: boolean;
  hotkeysEnabled: boolean;
}

export interface AIServiceStatus {
  isOnline: boolean;
  lastHealthCheck: number;
  config: AIServiceConfig;
  errorCount: number;
  successCount: number;
} 