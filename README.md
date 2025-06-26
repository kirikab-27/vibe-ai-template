# 🤖 VIBE AI Template

![License](https://img.shields.io/badge/license-MIT-green)
![React](https://img.shields.io/badge/React-18+-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue)
![AI Ready](https://img.shields.io/badge/AI-Ready-brightgreen)
![Development](https://img.shields.io/badge/Status-Phase%202%20Development-yellow)

**AI機能が最初から統合された React + TypeScript 開発テンプレート**

Claude Code SDK を活用した次世代の開発体験を提供します。別ターミナルでCLIを操作する必要がなく、ブラウザ上のUIから直接AI機能を利用できます。

> **⚠️ 開発段階について**  
> このプロジェクトは現在 **Phase 2 開発段階** です。基本的なAI機能は動作しますが、実際のClaude Code SDK統合やファイルシステム連携は模擬実装となっています。本格的な使用前にPhase 3以降の完成をお待ちください。

## 🚧 開発ステータス

### ✅ Phase 1 (完了) - 基本AI統合
- [x] フローティングAIボタン
- [x] 3タブ式UIパネル（チャット・分析・設定）
- [x] 基本的なAIサービス統合
- [x] オフライン対応
- [x] アニメーション付きUI

### 🔥 Phase 2 (完了) - 高度なAI機能
- [x] **ホットキー機能**: `Cmd/Ctrl+K` でAI起動
- [x] **ファイルコンテキスト**: プロジェクト構造認識
- [x] **知識ベース**: 構造化された開発知識検索
- [x] **4タブインターフェース**: 知識タブを追加
- [x] **コンテキスト提案**: ファイルタイプに基づく推奨事項

### 🚀 Phase 3 (予定) - 実際のAI統合
- [ ] **実際のClaude Code SDK統合**
- [ ] **File System Access API対応**
- [ ] **エディタ連携**（VS Code拡張等）
- [ ] **リアルタイムファイル監視**
- [ ] **プロジェクト知識の自動学習**

### 🌟 Phase 4 (予定) - 高度な機能
- [ ] **チーム知識共有**
- [ ] **カスタムAIモデル対応**
- [ ] **プラグインシステム**
- [ ] **CI/CD統合**

## ✨ 特徴

- 🚀 **即座に使える**: `npm run dev` でAI機能付きアプリが起動
- 🤖 **統合AI**: ブラウザUI内でコード分析・生成・チャット
- 🔥 **ホットキー対応**: `Cmd/Ctrl+K` でパワーユーザー向け操作
- 📚 **知識ベース**: 開発パターンとベストプラクティスの検索
- 🔄 **オフライン対応**: ネットワーク切断時も基本機能が動作
- ⚡ **高速**: Vite + React + TypeScript による最適化
- 🎨 **美しいUI**: Framer Motion + カスタムCSS

## 🎯 デモ

![AI Assistant Demo](./docs/demo.gif)

*注: 現在は模擬データを使用しています。Phase 3で実際のAI機能が統合されます。*

## 🚀 クイックスタート

### 前提条件

- Node.js 18+ 
- npm または yarn
- (将来) Claude Code CLI

### インストール

```bash
# テンプレートをクローン
git clone https://github.com/kirikab-27/vibe-ai-template.git
cd vibe-ai-template

# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev
```

### 🎉 完了！

ブラウザで `http://localhost:5173` を開くと：

1. **メインページ**: AI機能の説明が表示
2. **右下のAIボタン**: クリックでAIアシスタントが起動
3. **4つのタブ**: チャット・分析・知識・設定がすぐに利用可能
4. **ホットキー**: `Cmd/Ctrl+K` でAIアシスタント起動

## 🔧 使い方

### ⌨️ ホットキー機能（Phase 2新機能）

```
Cmd/Ctrl + K          → AIアシスタント起動/切り替え
Cmd/Ctrl + Shift + C  → チャット直接起動
Cmd/Ctrl + Shift + A  → コード分析直接起動
Escape                → パネルを閉じる
Cmd/Ctrl + ?          → ヘルプ表示
```

### 💬 チャット機能

```
質問例:
- "React コンポーネントを作成して"
- "TypeScript の型定義を教えて"  
- "API エンドポイントの例を見せて"
```

### 🔍 コード分析機能

```typescript
// 分析タブに以下のようなコードを入力
const Component = () => {
  const [state, setState] = useState();
  useEffect(() => {
    console.log('test');
  });
  return <div>Hello</div>;
};
```

**AIが自動で以下を検出:**
- 潜在的な問題（依存配列の不備など）
- 改善提案（型定義の追加など）
- コード品質スコア

### 📚 知識ベース機能（Phase 2新機能）

- **構造化検索**: 開発パターン・解決策・例・ノートから検索
- **コンテキスト提案**: 現在のファイルタイプに基づく推奨事項
- **関連知識**: 知識エントリー間の自動リンク
- **カテゴリフィルター**: 用途別の知識分類

### ⚙️ 設定

- **AIモデル選択**: Haiku（高速）/ Sonnet（バランス）/ Opus（高性能）
- **動作設定**: 自動分析、リアルタイムヘルプ等
- **ホットキー**: キーボードショートカットの有効/無効

## 📦 含まれているもの

### 🎯 AI機能
- **AIService**: Claude Code SDK ラッパー（Phase 3で実装予定）
- **コード分析**: 品質チェック・改善提案（現在は模擬実装）
- **チャット**: インタラクティブなAI対話（現在は模擬応答）
- **知識ベース**: 構造化された開発知識検索システム
- **設定管理**: カスタマイズ可能な動作設定

### 🧩 UIコンポーネント
- **AIFloatingButton**: フローティングアクションボタン
- **AIPanel**: 4タブ式AIインターフェース
- **CodeAnalyzer**: コード分析UI
- **ChatInterface**: チャットUI
- **KnowledgeBase**: 知識検索・閲覧UI（Phase 2新機能）
- **AISettings**: 設定管理UI

### 🔧 開発ツール
- **TypeScript**: 完全な型安全性
- **ESLint**: コード品質管理
- **Vite**: 高速ビルドツール
- **Framer Motion**: スムーズなアニメーション

## 📁 プロジェクト構造

```
vibe-ai-template/
├── src/
│   ├── components/ai/       # AI関連コンポーネント
│   │   ├── AIAssistant.tsx  # メイン統合コンポーネント
│   │   ├── AIPanel.tsx      # 4タブ式AIパネル
│   │   ├── CodeAnalyzer.tsx # コード分析UI
│   │   ├── ChatInterface.tsx # チャットUI
│   │   ├── KnowledgeBase.tsx # 知識ベースUI (New!)
│   │   └── AISettings.tsx   # 設定UI
│   ├── hooks/ai/           # AI関連フック
│   │   ├── useAIService.ts  # AIサービスフック
│   │   ├── useHotkeys.ts    # ホットキー管理 (New!)
│   │   └── useFileContext.ts # ファイルコンテキスト (New!)
│   ├── services/           # サービスレイヤー
│   │   ├── aiService.ts     # AIサービスクラス
│   │   └── knowledgeService.ts # 知識管理サービス (New!)
│   ├── types/              # 型定義
│   │   └── ai.ts           # AI関連型
│   └── App.tsx             # メインアプリ
├── .ai/                    # VIBE知識管理（継承）
└── package.json            # 依存関係
```

## 🤖 AI機能の詳細

### 現在の実装状況

| 機能 | Phase 2状況 | Phase 3予定 | 説明 |
|------|------------|-------------|------|
| コード分析 | 🟡 模擬実装 | 🟢 Claude統合 | 品質チェック・改善提案 |
| コード生成 | 🟡 模擬実装 | 🟢 Claude統合 | AIによるコード生成 |
| チャット | 🟡 模擬応答 | 🟢 Claude統合 | 質問・相談・学習 |
| 知識検索 | 🟢 完全実装 | 🟢 拡張予定 | プロジェクト知識ベース |
| ファイル監視 | 🟡 模擬実装 | 🟢 File System API | リアルタイム監視 |
| ホットキー | 🟢 完全実装 | 🟢 拡張予定 | キーボードショートカット |

### モデル選択（Phase 3で有効化予定）

- **Claude Haiku**: 高速レスポンス、日常的な開発に最適
- **Claude Sonnet**: バランス型、推奨設定
- **Claude Opus**: 高精度、複雑な処理に最適

## 🔄 カスタマイズ

### AI設定のカスタマイズ

```typescript
// src/services/aiService.ts
const customConfig = {
  preferredModel: 'sonnet',
  enableOfflineFallback: true,
  timeout: 30000
};
```

### UIのカスタマイズ

```typescript
// カスタムCSS クラスで簡単にスタイル変更
className="bg-blue-600 hover:bg-blue-700" // ボタン色
```

## 🚀 デプロイ

### Vercel

```bash
npm run build
npx vercel --prod
```

### Netlify

```bash
npm run build
# distフォルダをNetlifyにドラッグ&ドロップ
```

## 🤝 コントリビューション

現在Phase 2開発段階のため、以下の領域でコントリビューションを歓迎します：

1. **Phase 3準備**: Claude Code SDK統合の準備
2. **UI改善**: より良いユーザー体験の提案
3. **知識ベース拡充**: 開発パターンの追加
4. **ドキュメント**: 使用例やベストプラクティスの追加
5. **テスト**: 自動テストの追加

### コントリビューション手順

1. Fork this repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 🔮 ロードマップ

### Phase 3 (実際のAI統合) - 2025年Q2予定
- Claude Code SDK統合
- File System Access API対応
- エディタ連携（VS Code拡張等）

### Phase 4 (高度な機能) - 2025年Q3予定
- チーム知識共有機能
- カスタムAIモデル対応
- プラグインシステム

### Phase 5 (企業対応) - 2025年Q4予定
- セキュリティ強化
- 大規模プロジェクト対応
- 企業向け機能

## 📝 ライセンス

[MIT License](./LICENSE)

## 🙏 謝辞

- [Claude Code SDK](https://github.com/instantlyeasy/claude-code-sdk-ts) - AI機能の基盤（Phase 3で統合予定）
- [VIBE Coding Template](https://github.com/your-username/vibe-coding-template) - 元となるテンプレート
- [React](https://react.dev/) - UIフレームワーク
- [Vite](https://vitejs.dev/) - ビルドツール
- [Framer Motion](https://www.framer.com/motion/) - アニメーション
- [React Hotkeys Hook](https://github.com/JohannesKlauss/react-hotkeys-hook) - ホットキー機能

## 📞 サポート

- **Issues**: [GitHub Issues](https://github.com/kirikab-27/vibe-ai-template/issues)
- **Discussions**: [GitHub Discussions](https://github.com/kirikab-27/vibe-ai-template/discussions)
- **Documentation**: [Wiki](https://github.com/kirikab-27/vibe-ai-template/wiki)

## ⚡ 開発者向け情報

### 現在の技術制限

- **AI応答**: 現在は模擬実装のため、実際のAI分析は行われません
- **ファイル監視**: File System Access APIは未実装
- **エディタ連携**: VS Code等との連携は今後の予定
- **クラウド同期**: ローカルストレージのみ対応

### 実際のAI機能を試したい場合

Phase 3リリースまでお待ちいただくか、以下の代替案をご検討ください：

1. **Claude Code CLI**: 直接Claude Codeを使用
2. **GitHub Copilot**: エディタ統合済みAI
3. **Cursor**: AI統合エディタ

---

**🎉 Happy Coding with AI! 🤖**

このテンプレートは現在開発中ですが、Phase 3完成時には真のAI協働開発体験を提供します。進捗は随時更新されますので、⭐をつけてウォッチしてください！