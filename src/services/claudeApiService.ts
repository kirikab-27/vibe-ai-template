import type { AIAnalysisResult } from '../types/ai';

export interface ClaudeConfig {
  serverUrl: string;
  model: 'sonnet' | 'opus' | 'haiku';
  timeout: number;
}

export interface ClaudeResponse {
  response: string;
  model: string;
  timestamp: string;
  usage?: {
    input_tokens: number;
    output_tokens: number;
  };
}

export interface ClaudeCodeResponse {
  code: string;
  fileType: string;
  style: string;
  timestamp: string;
}

export interface ClaudeError {
  error: string;
  setup_required?: boolean;
  auth_required?: boolean;
  details?: string;
}

class ClaudeApiService {
  private config: ClaudeConfig;
  private rateLimitTracker = {
    requestCount: 0,
    resetTime: Date.now() + 60000, // 1分後にリセット
  };

  constructor(config: ClaudeConfig) {
    this.config = config;
  }

  // サーバーヘルスチェック
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.config.serverUrl}/api/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      return response.ok;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }

  // サーバーが利用可能かチェック
  async isConfigured(): Promise<boolean> {
    return await this.healthCheck();
  }

  // レート制限チェック
  private checkRateLimit(): boolean {
    const now = Date.now();
    
    if (now > this.rateLimitTracker.resetTime) {
      this.rateLimitTracker.requestCount = 0;
      this.rateLimitTracker.resetTime = now + 60000;
    }
    
    // 1分間に30リクエストまで制限（Claude CLI制限を考慮）
    if (this.rateLimitTracker.requestCount >= 30) {
      return false;
    }
    
    this.rateLimitTracker.requestCount++;
    return true;
  }

  // 汎用APIリクエスト
  private async makeRequest<T>(endpoint: string, data: any): Promise<T | null> {
    if (!this.checkRateLimit()) {
      throw new Error('Rate limit exceeded. Please wait a moment.');
    }

    try {
      const response = await fetch(`${this.config.serverUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(this.config.timeout),
      });

      if (!response.ok) {
        const errorData: ClaudeError = await response.json();
        this.handleApiError(errorData);
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed (${endpoint}):`, error);
      throw error;
    }
  }

  // エラーハンドリング
  private handleApiError(error: ClaudeError) {
    if (error.setup_required) {
      throw new Error(`Claude CLI setup required: ${error.error}`);
    } else if (error.auth_required) {
      throw new Error(`Authentication required: ${error.error}`);
    } else {
      throw new Error(`API Error: ${error.error}`);
    }
  }

  // チャット機能
  async chat(message: string, context?: string): Promise<string | null> {
    try {
      const fullMessage = context ? `${context}\n\n${message}` : message;
      
      const response = await this.makeRequest<ClaudeResponse>('/api/ai/chat', {
        message: fullMessage,
        model: this.config.model,
      });

      return response?.response || null;
    } catch (error) {
      console.error('Chat request failed:', error);
      return this.getFallbackChatResponse(message);
    }
  }

  // コード分析
  async analyzeCode(code: string, context?: string): Promise<AIAnalysisResult | null> {
    try {
      const prompt = this.buildCodeAnalysisPrompt(code, context);
      
      const response = await this.makeRequest<ClaudeResponse>('/api/ai/chat', {
        message: prompt,
        model: this.config.model,
      });

      if (response?.response) {
        return this.parseAnalysisResponse(response.response, code);
      }
      
      return this.getFallbackAnalysis(code);
    } catch (error) {
      console.error('Code analysis failed:', error);
      return this.getFallbackAnalysis(code);
    }
  }

  // コード生成
  async generateCode(prompt: string, language: string = 'typescript'): Promise<string | null> {
    try {
      const fullPrompt = this.buildCodeGenerationPrompt(prompt, language);
      
      const response = await this.makeRequest<ClaudeCodeResponse>('/api/ai/generate-code', {
        prompt: fullPrompt,
        fileType: language === 'typescript' ? 'tsx' : language,
        style: 'modern',
      });

      return response?.code || this.getFallbackCodeGeneration(prompt, language);
    } catch (error) {
      console.error('Code generation failed:', error);
      return this.getFallbackCodeGeneration(prompt, language);
    }
  }

  // ファイル操作
  async performFileOperation(operation: 'read' | 'write' | 'analyze', filePath: string, content?: string): Promise<string | null> {
    try {
      const response = await this.makeRequest<{ result: string }>('/api/ai/file-operation', {
        operation,
        filePath,
        content,
      });

      return response?.result || null;
    } catch (error) {
      console.error('File operation failed:', error);
      return null;
    }
  }

  // プロジェクト分析
  async analyzeProject(query?: string, directory?: string): Promise<any> {
    try {
      const response = await this.makeRequest<{ analysis: any }>('/api/ai/analyze-project', {
        query,
        directory,
      });

      return response?.analysis || null;
    } catch (error) {
      console.error('Project analysis failed:', error);
      return null;
    }
  }

  // プロンプト構築メソッド
  private buildCodeAnalysisPrompt(code: string, context?: string): string {
    return `
あなたは熟練したソフトウェアエンジニアです。以下のコードを分析して、JSON形式で結果を返してください。

${context ? `コンテキスト: ${context}` : ''}

分析対象のコード:
\`\`\`
${code}
\`\`\`

以下のJSON形式で応答してください:
{
  "codeQuality": "high" | "medium" | "low",
  "potentialIssues": ["問題1", "問題2"],
  "suggestions": ["提案1", "提案2"],
  "explanation": "詳細な説明",
  "confidence": 0.0-1.0
}

コード品質、潜在的な問題、改善提案を日本語で具体的に指摘してください。
    `.trim();
  }

  private buildCodeGenerationPrompt(prompt: string, language: string): string {
    return `
以下の要求に基づいて${language}コードを生成してください。

要求: ${prompt}

要件:
- 実用的で動作するコードを生成
- ベストプラクティスに従う
- 適切なコメントを含める
- TypeScriptの場合は型安全性を重視

コードのみを返してください（説明は不要）
    `.trim();
  }

  // レスポンス解析メソッド
  private parseAnalysisResponse(content: string, originalCode: string): AIAnalysisResult {
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          codeQuality: parsed.codeQuality || 'medium',
          potentialIssues: parsed.potentialIssues || [],
          suggestions: parsed.suggestions || [],
          explanation: parsed.explanation || 'Claude Code SDKによる分析',
          confidence: parsed.confidence || 0.8,
          source: 'claude-code-sdk',
          timestamp: Date.now()
        };
      }
    } catch (error) {
      console.error('Failed to parse Claude response:', error);
    }

    return this.getFallbackAnalysis(originalCode);
  }

  // フォールバック実装
  private getFallbackAnalysis(code: string): AIAnalysisResult {
    const lines = code.split('\n').length;
    const hasTypes = code.includes(': ') || code.includes('interface ') || code.includes('type ');
    const hasComments = code.includes('//') || code.includes('/*');
    
    return {
      codeQuality: lines > 50 ? 'medium' : hasTypes && hasComments ? 'high' : 'low',
      potentialIssues: [
        !hasTypes ? 'TypeScript型注釈が不足している可能性があります' : '',
        !hasComments ? 'コメントが不足している可能性があります' : '',
        lines > 100 ? 'ファイルが大きすぎる可能性があります' : ''
      ].filter(Boolean),
      suggestions: [
        'コードレビューを実施してください',
        'テストケースを追加することを検討してください',
        hasTypes ? '' : 'TypeScript型定義を追加してください'
      ].filter(Boolean),
      explanation: 'オフライン分析による基本的なコード品質チェック',
      confidence: 0.6,
      source: 'fallback',
      timestamp: Date.now()
    };
  }

  private getFallbackChatResponse(message: string): string {
    return `Claude Code SDK サーバーが利用できないため、オフライン応答をお送りします。

サーバーが動作していることを確認してください:
1. npm run dev でサーバーを起動
2. Claude CLI がインストールされていることを確認: npm install -g @anthropic-ai/claude-code
3. Claude認証を確認: claude login

ご質問: "${message}"`;
  }

  private getFallbackCodeGeneration(prompt: string, language: string): string {
    return `// ${language}コードのサンプル（オフライン生成）
// 要求: ${prompt}

// Claude Code SDK サーバーが利用できないため、基本的なテンプレートを提供します
// 実際のコード生成にはサーバーの起動とClaude認証が必要です

export function generatedFunction() {
  // TODO: 実装を追加してください
  console.log('Generated from prompt: ${prompt}');
}`;
  }

  // 設定更新
  updateConfig(newConfig: Partial<ClaudeConfig>) {
    this.config = { ...this.config, ...newConfig };
  }

  // 使用統計取得
  getUsageStats() {
    return {
      requestCount: this.rateLimitTracker.requestCount,
      resetTime: this.rateLimitTracker.resetTime,
      serverUrl: this.config.serverUrl,
      model: this.config.model,
      timeout: this.config.timeout
    };
  }

  // 認証ステータス確認
  async getAuthStatus(): Promise<{ isAuthenticated: boolean; requiresSetup: boolean; message: string }> {
    try {
      const isHealthy = await this.healthCheck();
      
      if (!isHealthy) {
        return {
          isAuthenticated: false,
          requiresSetup: true,
          message: 'Claude Code SDK サーバーが起動していません。npm run dev でサーバーを起動してください。'
        };
      }

      // 簡単なテストクエリを送信
      const testResponse = await this.makeRequest<ClaudeResponse>('/api/ai/chat', {
        message: 'Hello',
        model: this.config.model,
      });

      if (testResponse) {
        return {
          isAuthenticated: true,
          requiresSetup: false,
          message: 'Claude Code SDK は正常に動作しています。'
        };
      } else {
        return {
          isAuthenticated: false,
          requiresSetup: true,
          message: 'Claude認証が必要です。claude login を実行してください。'
        };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      if (errorMessage.includes('setup required')) {
        return {
          isAuthenticated: false,
          requiresSetup: true,
          message: 'Claude CLI のインストールが必要です。npm install -g @anthropic-ai/claude-code'
        };
      } else if (errorMessage.includes('auth required')) {
        return {
          isAuthenticated: false,
          requiresSetup: false,
          message: 'Claude認証が必要です。claude login を実行してください。'
        };
      } else {
        return {
          isAuthenticated: false,
          requiresSetup: true,
          message: `接続エラー: ${errorMessage}`
        };
      }
    }
  }
}

// デフォルト設定
const defaultConfig: ClaudeConfig = {
  serverUrl: 'http://localhost:3001',
  model: 'sonnet',
  timeout: 30000, // 30秒
};

// シングルトンインスタンス
export const claudeApiService = new ClaudeApiService(defaultConfig); 