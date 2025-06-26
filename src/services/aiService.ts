import type { AIServiceConfig, AIAnalysisResult, AIServiceStatus } from '../types/ai';

export class AIService {
  private isOnline = true;
  private config: AIServiceConfig;
  private healthCheckInterval?: number;
  private errorCount = 0;
  private successCount = 0;
  private lastHealthCheck = Date.now();

  constructor(config: Partial<AIServiceConfig> = {}) {
    this.config = {
      timeout: 30000,
      retryAttempts: 3,
      preferredModel: 'sonnet',
      enableOfflineFallback: true,
      ...config
    };
    
    this.initHealthCheck();
  }

  private initHealthCheck() {
    // Vite環境では開発サーバーのヘルスチェックのみ
    this.healthCheckInterval = window.setInterval(async () => {
      try {
        this.lastHealthCheck = Date.now();
        // 開発環境では常にオンラインとみなす
        this.isOnline = true;
      } catch {
        this.isOnline = false;
      }
    }, 30000);
  }

  async analyzeCode(code: string, context?: string): Promise<AIAnalysisResult> {
    try {
      if (this.isOnline) {
        return await this.claudeAnalyze(code, context);
      }
    } catch (error) {
      console.warn('Claude analysis failed, falling back to local', error);
      this.errorCount++;
      this.isOnline = false;
    }
    
    if (this.config.enableOfflineFallback) {
      return await this.localAnalyze(code, context);
    }
    
    throw new Error('AI service unavailable and offline fallback disabled');
  }

  private async claudeAnalyze(code: string, context?: string): Promise<AIAnalysisResult> {
    // 将来的にClaude Code SDKが利用可能になった場合の実装
    // 現在は開発用のモック応答を返す
    return this.createMockAnalysis(code, context, 'claude');
  }

  private async localAnalyze(code: string, context?: string): Promise<AIAnalysisResult> {
    return this.createMockAnalysis(code, context, 'local_knowledge');
  }

  private async createMockAnalysis(
    code: string, 
    context?: string, 
    source: 'claude' | 'local_knowledge' = 'local_knowledge'
  ): Promise<AIAnalysisResult> {
    // 実際のコード分析ロジック
    const suggestions: string[] = [];
    const potentialIssues: string[] = [];

    // TypeScript関連のチェック
    if (code.includes('any')) {
      potentialIssues.push('TypeScriptの`any`型が使用されています。より具体的な型を使用することを検討してください。');
    }

    if (code.includes('console.log')) {
      suggestions.push('デバッグ用のconsole.logが残っています。本番環境では削除を検討してください。');
    }

    // React関連のチェック
    if (code.includes('useEffect') && !code.includes('[]')) {
      potentialIssues.push('useEffectに依存配列が設定されていない可能性があります。無限ループを避けるため確認してください。');
    }

    if (code.includes('useState') && code.includes('state')) {
      suggestions.push('stateの命名がより具体的になるよう検討してください。');
    }

    // パフォーマンス関連
    if (code.includes('map') && code.includes('filter')) {
      suggestions.push('mapとfilterの連続使用があります。パフォーマンスを考慮してreduce等への変更を検討してください。');
    }

    // セキュリティ関連
    if (code.includes('innerHTML')) {
      potentialIssues.push('innerHTMLの使用は XSS脆弱性のリスクがあります。より安全な方法を検討してください。');
    }

    // コード品質の評価
    let codeQuality: 'high' | 'medium' | 'low' = 'high';
    if (potentialIssues.length > 2) {
      codeQuality = 'low';
    } else if (potentialIssues.length > 0) {
      codeQuality = 'medium';
    }

    const confidence = source === 'claude' ? 'high' : 'medium';

    this.successCount++;

    return {
      suggestions,
      potentialIssues,
      codeQuality,
      source,
      confidence,
      timestamp: Date.now(),
      explanation: `コードを分析しました。${potentialIssues.length}個の潜在的な問題と${suggestions.length}個の改善提案が見つかりました。${context ? `コンテキスト「${context}」を考慮しています。` : ''}`
    };
  }

  async generateCode(prompt: string): Promise<string> {
    // 開発用のモック実装
    this.successCount++;
    
    return `// ${prompt}に基づいて生成されたコード
// 注意: これは開発用のモック実装です

interface GeneratedInterface {
  id: string;
  name: string;
  createdAt: Date;
}

export function generatedFunction(): GeneratedInterface {
  return {
    id: '${Math.random().toString(36).substr(2, 9)}',
    name: 'Generated Item',
    createdAt: new Date()
  };
}

// TODO: 実際のClaude Code SDKによる実装に置き換える`;
  }

  getStatus(): AIServiceStatus {
    return {
      isOnline: this.isOnline,
      lastHealthCheck: this.lastHealthCheck,
      config: this.config,
      errorCount: this.errorCount,
      successCount: this.successCount
    };
  }

  updateConfig(newConfig: Partial<AIServiceConfig>) {
    this.config = { ...this.config, ...newConfig };
  }

  destroy() {
    if (this.healthCheckInterval) {
      window.clearInterval(this.healthCheckInterval);
    }
  }
}

// シングルトンインスタンス
export const aiService = new AIService(); 