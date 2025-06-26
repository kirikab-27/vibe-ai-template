import type { FileContext } from '../hooks/ai/useFileContext';

export interface KnowledgeEntry {
  id: string;
  title: string;
  content: string;
  tags: string[];
  category: 'pattern' | 'solution' | 'example' | 'note';
  relevance?: number;
  lastUpdated: number;
  relatedFiles?: string[];
}

export interface SearchResult {
  entry: KnowledgeEntry;
  score: number;
  matchType: 'exact' | 'partial' | 'semantic';
  highlightedContent: string;
}

export interface ContextualSuggestion {
  type: 'pattern' | 'improvement' | 'related' | 'example';
  title: string;
  description: string;
  action?: string;
  priority: 'high' | 'medium' | 'low';
}

class KnowledgeService {
  private knowledgeBase: KnowledgeEntry[] = [];
  private initialized = false;

  constructor() {
    this.initializeKnowledgeBase();
  }

  // 知識ベースの初期化
  private async initializeKnowledgeBase() {
    if (this.initialized) return;

    // 既存の.aiディレクトリの知識を統合
    const coreKnowledge: KnowledgeEntry[] = [
      {
        id: 'react-component-pattern',
        title: 'React関数コンポーネントのベストプラクティス',
        content: `
React関数コンポーネントを作成する際の推奨パターン:

\`\`\`typescript
import React from 'react';

interface ComponentProps {
  title: string;
  children?: React.ReactNode;
  onAction?: () => void;
}

export function Component({ title, children, onAction }: ComponentProps) {
  return (
    <div className="component">
      <h2>{title}</h2>
      {children}
      {onAction && (
        <button onClick={onAction}>Action</button>
      )}
    </div>
  );
}
\`\`\`

重要なポイント:
- インターフェースで型定義
- 関数宣言を使用
- children は React.ReactNode 型
- ハンドラーは optional で && を使用
        `,
        tags: ['react', 'typescript', 'component', 'pattern'],
        category: 'pattern',
        lastUpdated: Date.now(),
        relatedFiles: ['src/components/']
      },
      {
        id: 'ai-integration-pattern',
        title: 'AIサービス統合パターン',
        content: `
AIサービスをReactアプリに統合する推奨パターン:

\`\`\`typescript
// 1. サービスクラスでAIロジックを分離
export class AIService {
  async analyzeCode(code: string): Promise<AnalysisResult> {
    // AI処理
  }
}

// 2. カスタムフックでReact統合
export function useAIService() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const analyzeCode = useCallback(async (code: string) => {
    setIsLoading(true);
    try {
      const result = await aiService.analyzeCode(code);
      return result;
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { analyzeCode, isLoading, error };
}

// 3. コンポーネントで使用
function CodeAnalyzer() {
  const { analyzeCode, isLoading } = useAIService();
  // UI実装
}
\`\`\`
        `,
        tags: ['ai', 'react', 'service', 'hooks', 'pattern'],
        category: 'pattern',
        lastUpdated: Date.now(),
        relatedFiles: ['src/services/aiService.ts', 'src/hooks/ai/']
      },
      {
        id: 'typescript-error-handling',
        title: 'TypeScriptエラーハンドリング',
        content: `
型安全なエラーハンドリングパターン:

\`\`\`typescript
// Result型パターン
type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };

async function safeApiCall<T>(fn: () => Promise<T>): Promise<Result<T>> {
  try {
    const data = await fn();
    return { success: true, data };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error : new Error(String(error))
    };
  }
}

// 使用例
const result = await safeApiCall(() => aiService.analyzeCode(code));
if (result.success) {
  console.log(result.data); // 型安全
} else {
  console.error(result.error.message);
}
\`\`\`
        `,
        tags: ['typescript', 'error-handling', 'pattern'],
        category: 'solution',
        lastUpdated: Date.now()
      },
      {
        id: 'framer-motion-animations',
        title: 'Framer Motionアニメーションパターン',
        content: `
UI要素のスムーズなアニメーション実装:

\`\`\`typescript
import { motion, AnimatePresence } from 'framer-motion';

// 基本的なフェードイン
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.2 }}
>
  Content
</motion.div>

// スライドアウトパネル
<motion.div
  initial={{ scale: 0, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  exit={{ scale: 0, opacity: 0 }}
  transition={{ type: "spring", stiffness: 300, damping: 30 }}
  style={{ originX: 1, originY: 1 }}
>
  Panel Content
</motion.div>

// タブ切り替え
<AnimatePresence mode="wait">
  <motion.div
    key={activeTab}
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    transition={{ duration: 0.2 }}
  >
    Tab Content
  </motion.div>
</AnimatePresence>
\`\`\`
        `,
        tags: ['framer-motion', 'animation', 'ui', 'react'],
        category: 'example',
        lastUpdated: Date.now(),
        relatedFiles: ['src/components/ai/AIPanel.tsx']
      }
    ];

    this.knowledgeBase = coreKnowledge;
    this.initialized = true;
    console.log(`📚 Knowledge base initialized with ${this.knowledgeBase.length} entries`);
  }

  // テキスト検索
  search(query: string, maxResults = 10): SearchResult[] {
    const results: SearchResult[] = [];
    const queryLower = query.toLowerCase();

    this.knowledgeBase.forEach(entry => {
      let score = 0;
      let matchType: SearchResult['matchType'] = 'partial';

      // タイトル完全一致
      if (entry.title.toLowerCase().includes(queryLower)) {
        score += 100;
        matchType = 'exact';
      }

      // タグ一致
      entry.tags.forEach(tag => {
        if (tag.toLowerCase().includes(queryLower)) {
          score += 50;
        }
      });

      // コンテンツ部分一致
      if (entry.content.toLowerCase().includes(queryLower)) {
        score += 30;
      }

      // カテゴリ一致
      if (entry.category.toLowerCase().includes(queryLower)) {
        score += 20;
      }

      if (score > 0) {
        const highlightedContent = this.highlightMatches(entry.content, query);
        results.push({
          entry,
          score,
          matchType,
          highlightedContent
        });
      }
    });

    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, maxResults);
  }

  // コンテキストに基づく提案
  getContextualSuggestions(fileContext: FileContext): ContextualSuggestion[] {
    const suggestions: ContextualSuggestion[] = [];
    const { currentFile, projectStructure, workspaceStats } = fileContext;

    // 現在のファイルタイプに基づく提案
    if (currentFile) {
      const extension = currentFile.split('.').pop();
      
      switch (extension) {
        case 'tsx':
        case 'jsx':
          suggestions.push({
            type: 'pattern',
            title: 'Reactコンポーネント最適化',
            description: 'React.memo、useMemo、useCallbackを使った最適化パターンを確認',
            action: 'optimization-patterns',
            priority: 'medium'
          });
          break;
          
        case 'ts':
          suggestions.push({
            type: 'improvement',
            title: 'TypeScript型安全性向上',
            description: 'strict設定とユーティリティ型の活用方法',
            action: 'typescript-safety',
            priority: 'high'
          });
          break;
      }
    }

    // プロジェクト統計に基づく提案
    const hasAIFiles = projectStructure.some(f => 
      f.path.includes('ai') || f.path.includes('AI')
    );
    
    if (hasAIFiles) {
      suggestions.push({
        type: 'related',
        title: 'AI統合パターン',
        description: 'AI機能の実装と最適化に関するベストプラクティス',
        action: 'ai-patterns',
        priority: 'high'
      });
    }

    // ファイル数に基づく提案
    if (workspaceStats.totalFiles > 20) {
      suggestions.push({
        type: 'improvement',
        title: 'プロジェクト構造整理',
        description: 'ファイル数が増えています。モジュール化とフォルダ構造の見直しを検討',
        priority: 'low'
      });
    }

    return suggestions.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  // 関連知識の取得
  getRelatedEntries(entryId: string, maxResults = 5): KnowledgeEntry[] {
    const targetEntry = this.knowledgeBase.find(e => e.id === entryId);
    if (!targetEntry) return [];

    const related = this.knowledgeBase
      .filter(entry => entry.id !== entryId)
      .map(entry => {
        let score = 0;
        
        // タグの共通数
        const commonTags = targetEntry.tags.filter(tag => 
          entry.tags.includes(tag)
        ).length;
        score += commonTags * 10;

        // カテゴリ一致
        if (entry.category === targetEntry.category) {
          score += 5;
        }

        // 関連ファイル一致
        if (targetEntry.relatedFiles && entry.relatedFiles) {
          const commonFiles = targetEntry.relatedFiles.filter(file =>
            entry.relatedFiles!.some(f => f.includes(file) || file.includes(f))
          ).length;
          score += commonFiles * 3;
        }

        return { entry, score };
      })
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, maxResults)
      .map(({ entry }) => entry);

    return related;
  }

  // 知識エントリーの追加
  addEntry(entry: Omit<KnowledgeEntry, 'id' | 'lastUpdated'>): string {
    const id = `custom-${Date.now()}`;
    const newEntry: KnowledgeEntry = {
      ...entry,
      id,
      lastUpdated: Date.now()
    };

    this.knowledgeBase.push(newEntry);
    console.log(`📚 Added new knowledge entry: ${entry.title}`);
    return id;
  }

  // 検索結果のハイライト
  private highlightMatches(content: string, query: string): string {
    const regex = new RegExp(`(${query})`, 'gi');
    return content.replace(regex, '<mark>$1</mark>');
  }

  // すべてのエントリーを取得
  getAllEntries(): KnowledgeEntry[] {
    return [...this.knowledgeBase];
  }

  // カテゴリ別エントリー取得
  getEntriesByCategory(category: KnowledgeEntry['category']): KnowledgeEntry[] {
    return this.knowledgeBase.filter(entry => entry.category === category);
  }

  // タグ別エントリー取得
  getEntriesByTag(tag: string): KnowledgeEntry[] {
    return this.knowledgeBase.filter(entry => 
      entry.tags.some(t => t.toLowerCase().includes(tag.toLowerCase()))
    );
  }
}

// シングルトンインスタンス
export const knowledgeService = new KnowledgeService(); 