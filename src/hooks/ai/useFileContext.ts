import { useState, useEffect, useCallback } from 'react';

export interface FileContext {
  currentFile?: string;
  currentContent?: string;
  projectStructure: ProjectFile[];
  recentFiles: string[];
  workspaceStats: WorkspaceStats;
}

export interface ProjectFile {
  path: string;
  type: 'file' | 'directory';
  extension?: string;
  size?: number;
  lastModified?: number;
}

export interface WorkspaceStats {
  totalFiles: number;
  totalSize: number;
  fileTypes: Record<string, number>;
  lastActivity?: number;
}

export function useFileContext() {
  const [fileContext, setFileContext] = useState<FileContext>({
    projectStructure: [],
    recentFiles: [],
    workspaceStats: {
      totalFiles: 0,
      totalSize: 0,
      fileTypes: {}
    }
  });

  const [isScanning, setIsScanning] = useState(false);

  // プロジェクト構造をスキャン（模擬実装）
  const scanProjectStructure = useCallback(async (): Promise<ProjectFile[]> => {
    // 実際の実装では、File System Access API やブラウザのファイル選択を使用
    // 今回は典型的なReactプロジェクト構造を模擬
    const mockStructure: ProjectFile[] = [
      { path: 'src/App.tsx', type: 'file', extension: 'tsx', size: 2048, lastModified: Date.now() },
      { path: 'src/components/', type: 'directory' },
      { path: 'src/components/ai/', type: 'directory' },
      { path: 'src/components/ai/AIAssistant.tsx', type: 'file', extension: 'tsx', size: 1024 },
      { path: 'src/components/ai/AIPanel.tsx', type: 'file', extension: 'tsx', size: 3072 },
      { path: 'src/components/ai/ChatInterface.tsx', type: 'file', extension: 'tsx', size: 4096 },
      { path: 'src/components/ai/CodeAnalyzer.tsx', type: 'file', extension: 'tsx', size: 5120 },
      { path: 'src/hooks/ai/', type: 'directory' },
      { path: 'src/hooks/ai/useAIService.ts', type: 'file', extension: 'ts', size: 2048 },
      { path: 'src/services/', type: 'directory' },
      { path: 'src/services/aiService.ts', type: 'file', extension: 'ts', size: 3072 },
      { path: 'src/types/ai.ts', type: 'file', extension: 'ts', size: 1024 },
      { path: 'package.json', type: 'file', extension: 'json', size: 2048 },
      { path: 'tsconfig.json', type: 'file', extension: 'json', size: 512 },
      { path: 'vite.config.ts', type: 'file', extension: 'ts', size: 256 },
    ];

    return mockStructure;
  }, []);

  // ワークスペース統計の計算
  const calculateWorkspaceStats = useCallback((files: ProjectFile[]): WorkspaceStats => {
    const fileTypes: Record<string, number> = {};
    let totalFiles = 0;
    let totalSize = 0;

    files.forEach(file => {
      if (file.type === 'file') {
        totalFiles++;
        totalSize += file.size || 0;
        
        if (file.extension) {
          fileTypes[file.extension] = (fileTypes[file.extension] || 0) + 1;
        }
      }
    });

    return {
      totalFiles,
      totalSize,
      fileTypes,
      lastActivity: Date.now()
    };
  }, []);

  // 現在のファイルコンテンツを取得（模擬）
  const getCurrentFileContent = useCallback(async (filePath: string): Promise<string> => {
    // 実際の実装では、エディタのAPIやFile System Access APIを使用
    // 今回は模擬的なコンテンツを返す
    const mockContent = `// ${filePath}
import React from 'react';

const Component = () => {
  return (
    <div>
      {/* This is mock content for ${filePath} */}
    </div>
  );
};

export default Component;`;

    return mockContent;
  }, []);

  // 最近使用したファイルを追跡
  const addRecentFile = useCallback((filePath: string) => {
    setFileContext(prev => {
      const recentFiles = [filePath, ...prev.recentFiles.filter(f => f !== filePath)].slice(0, 10);
      return {
        ...prev,
        recentFiles,
        currentFile: filePath
      };
    });
  }, []);

  // 現在のファイルを設定
  const setCurrentFile = useCallback(async (filePath: string) => {
    try {
      const content = await getCurrentFileContent(filePath);
      setFileContext(prev => ({
        ...prev,
        currentFile: filePath,
        currentContent: content
      }));
      addRecentFile(filePath);
    } catch (error) {
      console.error('Failed to load file content:', error);
    }
  }, [getCurrentFileContent, addRecentFile]);

  // プロジェクトをスキャン
  const scanProject = useCallback(async () => {
    setIsScanning(true);
    try {
      const structure = await scanProjectStructure();
      const stats = calculateWorkspaceStats(structure);
      
      setFileContext(prev => ({
        ...prev,
        projectStructure: structure,
        workspaceStats: stats
      }));
    } catch (error) {
      console.error('Failed to scan project:', error);
    } finally {
      setIsScanning(false);
    }
  }, [scanProjectStructure, calculateWorkspaceStats]);

  // プロジェクトコンテキストを取得（AI用）
  const getProjectContext = useCallback((): string => {
    const { projectStructure, workspaceStats, currentFile, recentFiles } = fileContext;
    
    return `
## プロジェクトコンテキスト

### 現在のファイル
${currentFile || 'なし'}

### 最近使用したファイル
${recentFiles.slice(0, 5).map(f => `- ${f}`).join('\n')}

### プロジェクト統計
- 総ファイル数: ${workspaceStats.totalFiles}
- 総サイズ: ${(workspaceStats.totalSize / 1024).toFixed(1)}KB
- ファイルタイプ: ${Object.entries(workspaceStats.fileTypes)
      .map(([ext, count]) => `${ext}(${count})`)
      .join(', ')}

### プロジェクト構造
${projectStructure
  .filter(f => f.type === 'file')
  .slice(0, 15)
  .map(f => `- ${f.path}`)
  .join('\n')}
${projectStructure.filter(f => f.type === 'file').length > 15 ? '...' : ''}
    `.trim();
  }, [fileContext]);

  // 初期化時にプロジェクトをスキャン
  useEffect(() => {
    scanProject();
  }, [scanProject]);

  // ファイル変更を監視（模擬）
  useEffect(() => {
    const interval = setInterval(() => {
      // 実際の実装では、File System Watcher やエディタのイベントを使用
      console.log('📁 Watching for file changes...');
    }, 30000); // 30秒ごとにチェック

    return () => clearInterval(interval);
  }, []);

  return {
    fileContext,
    isScanning,
    setCurrentFile,
    addRecentFile,
    scanProject,
    getProjectContext,
    getCurrentFileContent
  };
} 