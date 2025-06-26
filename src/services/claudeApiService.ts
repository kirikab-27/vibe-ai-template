import Anthropic from '@anthropic-ai/sdk';
import type { AIAnalysisResult } from '../types/ai';

export interface ClaudeConfig {
  apiKey?: string;
  model: 'claude-3-haiku-20240307' | 'claude-3-sonnet-20240229' | 'claude-3-opus-20240229';
  maxTokens: number;
  temperature: number;
}

export interface ClaudeResponse {
  content: string;
  usage?: {
    input_tokens: number;
    output_tokens: number;
  };
}

class ClaudeApiService {
  private client: Anthropic | null = null;
  private config: ClaudeConfig;
  private rateLimitTracker = {
    requestCount: 0,
    resetTime: Date.now() + 60000, // 1分後にリセット
  };

  constructor(config: ClaudeConfig) {
    this.config = config;
    this.initializeClient();
  }

  private initializeClient() {
    const apiKey = this.config.apiKey || this.getStoredApiKey();
    
    if (apiKey) {
      try {
        this.client = new Anthropic({
          apiKey: apiKey,
          dangerouslyAllowBrowser: true // ブラウザ環境での使用を許可
        });
        console.log('🤖 Claude API client initialized');
      } catch (error) {
        console.error('Failed to initialize Claude client:', error);
        this.client = null;
      }
    }
  }

  // APIキーの設定
  setApiKey(apiKey: string): boolean {
    try {
      this.config.apiKey = apiKey;
      localStorage.setItem('claude-api-key', apiKey);
      this.initializeClient();
      return true;
    } catch (error) {
      console.error('Failed to set API key:', error);
      return false;
    }
  }

  // ローカルストレージからAPIキーを取得
  private getStoredApiKey(): string | null {
    try {
      return localStorage.getItem('claude-api-key');
    } catch {
      return null;
    }
  }

  // APIキーが設定されているかチェック
  isConfigured(): boolean {
    return this.client !== null;
  }

  // レート制限チェック
  private checkRateLimit(): boolean {
    const now = Date.now();
    
    if (now > this.rateLimitTracker.resetTime) {
      this.rateLimitTracker.requestCount = 0;
      this.rateLimitTracker.resetTime = now + 60000;
    }
    
    // 1分間に60リクエストまで制限
    if (this.rateLimitTracker.requestCount >= 60) {
      return false;
    }
    
    this.rateLimitTracker.requestCount++;
    return true;
  }

  // コード分析
  async analyzeCode(code: string, context?: string): Promise<AIAnalysisResult | null> {
    if (!this.client || !this.checkRateLimit()) {
      return this.getFallbackAnalysis(code);
    }

    try {
      const prompt = this.buildCodeAnalysisPrompt(code, context);
      
      const response = await this.client.messages.create({
        model: this.config.model,
        max_tokens: this.config.maxTokens,
        temperature: this.config.temperature,
        messages: [{
          role: 'user',
          content: prompt
        }]
      });

      return this.parseAnalysisResponse(response, code);
    } catch (error) {
      console.error('Claude API error:', error);
      return this.getFallbackAnalysis(code);
    }
  }

  // チャット応答
  async chat(message: string, context?: string): Promise<string | null> {
    if (!this.client || !this.checkRateLimit()) {
      return this.getFallbackChatResponse(message);
    }

    try {
      const prompt = this.buildChatPrompt(message, context);
      
      const response = await this.client.messages.create({
        model: this.config.model,
        max_tokens: this.config.maxTokens,
        temperature: this.config.temperature,
        messages: [{
          role: 'user',
          content: prompt
        }]
      });

      return this.extractTextContent(response);
    } catch (error) {
      console.error('Claude API error:', error);
      return this.getFallbackChatResponse(message);
    }
  }

  // コード生成
  async generateCode(prompt: string, language: string = 'typescript'): Promise<string | null> {
    if (!this.client || !this.checkRateLimit()) {
      return this.getFallbackCodeGeneration(prompt, language);
    }

    try {
      const fullPrompt = this.buildCodeGenerationPrompt(prompt, language);
      
      const response = await this.client.messages.create({
        model: this.config.model,
        max_tokens: this.config.maxTokens,
        temperature: 0.3, // コード生成では温度を低めに設定
        messages: [{
          role: 'user',
          content: fullPrompt
        }]
      });

      return this.extractCodeFromResponse(response);
    } catch (error) {
      console.error('Claude API error:', error);
      return this.getFallbackCodeGeneration(prompt, language);
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

  private buildChatPrompt(message: string, context?: string): string {
    return `
あなたは親切で知識豊富なプログラミングアシスタントです。
${context ? `現在のコンテキスト: ${context}` : ''}

ユーザーの質問: ${message}

日本語で親切に、具体的で実用的な回答をしてください。
コード例を含める場合は、TypeScript/Reactを使用してください。
    `.trim();
  }

  private buildCodeGenerationPrompt(prompt: string, language: string): string {
    return `
あなたは優秀なソフトウェアエンジニアです。以下の要求に基づいて${language}コードを生成してください。

要求: ${prompt}

要件:
- 実用的で動作するコードを生成
- ベストプラクティスに従う
- 適切なコメントを含める
- TypeScriptの場合は型安全性を重視

コードのみを返してください（説明は不要）:
    `.trim();
  }

  // レスポンス解析メソッド
  private parseAnalysisResponse(response: any, originalCode: string): AIAnalysisResult {
    try {
      const content = this.extractTextContent(response);
      const jsonMatch = content?.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          codeQuality: parsed.codeQuality || 'medium',
          potentialIssues: parsed.potentialIssues || [],
          suggestions: parsed.suggestions || [],
          explanation: parsed.explanation || 'Claude APIによる分析',
          confidence: parsed.confidence || 0.8,
          source: 'claude',
          timestamp: Date.now()
        };
      }
    } catch (error) {
      console.error('Failed to parse Claude response:', error);
    }

    return this.getFallbackAnalysis(originalCode);
  }

  private extractTextContent(response: any): string | null {
    try {
      if (response.content && response.content[0] && response.content[0].text) {
        return response.content[0].text;
      }
    } catch (error) {
      console.error('Failed to extract text content:', error);
    }
    return null;
  }

  private extractCodeFromResponse(response: any): string | null {
    const content = this.extractTextContent(response);
    if (!content) return null;

    // コードブロックを抽出
    const codeMatch = content.match(/```[\w]*\n([\s\S]*?)```/);
    return codeMatch ? codeMatch[1].trim() : content.trim();
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
    const responses = [
      'Claude APIが利用できないため、オフライン応答をお送りします。',
      'その質問にお答えするには、Claude APIの設定が必要です。',
      '現在オフラインモードです。APIキーを設定してオンライン機能をお試しください。'
    ];
    
    return responses[Math.floor(Math.random() * responses.length)] + 
           '\n\n' + `ご質問: "${message}"`;
  }

  private getFallbackCodeGeneration(prompt: string, language: string): string {
    return `// ${language}コードのサンプル（オフライン生成）
// 要求: ${prompt}

// Claude APIが利用できないため、基本的なテンプレートを提供します
// 実際のコード生成にはAPIキーの設定が必要です

export function generatedFunction() {
  // TODO: 実装を追加してください
  console.log('Generated from prompt: ${prompt}');
}`;
  }

  // 設定更新
  updateConfig(newConfig: Partial<ClaudeConfig>) {
    this.config = { ...this.config, ...newConfig };
    if (newConfig.apiKey) {
      this.initializeClient();
    }
  }

  // ヘルスチェック
  async healthCheck(): Promise<boolean> {
    if (!this.client) return false;

    try {
      const response = await this.client.messages.create({
        model: this.config.model,
        max_tokens: 10,
        messages: [{
          role: 'user',
          content: 'Health check'
        }]
      });

      return !!response;
    } catch {
      return false;
    }
  }

  // 使用統計取得
  getUsageStats() {
    return {
      requestCount: this.rateLimitTracker.requestCount,
      resetTime: this.rateLimitTracker.resetTime,
      isConfigured: this.isConfigured(),
      model: this.config.model
    };
  }
}

// デフォルト設定
const defaultConfig: ClaudeConfig = {
  model: 'claude-3-sonnet-20240229',
  maxTokens: 1000,
  temperature: 0.7
};

// シングルトンインスタンス
export const claudeApiService = new ClaudeApiService(defaultConfig); 