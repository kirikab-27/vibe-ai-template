# 🤖 VIBE AI Template

![License](https://img.shields.io/badge/license-MIT-green)
![React](https://img.shields.io/badge/React-18+-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue)
![AI Ready](https://img.shields.io/badge/AI-Ready-brightgreen)

**AI機能が最初から統合された React + TypeScript 開発テンプレート**

Claude Code SDK を活用した次世代の開発体験を提供します。別ターミナルでCLIを操作する必要がなく、ブラウザ上のUIから直接AI機能を利用できます。

## ✨ 特徴

- 🚀 **即座に使える**: `npm run dev` でAI機能付きアプリが起動
- 🤖 **統合AI**: ブラウザUI内でコード分析・生成・チャット
- 🔄 **オフライン対応**: ネットワーク切断時も基本機能が動作
- ⚡ **高速**: Vite + React + TypeScript による最適化
- 🎨 **美しいUI**: Framer Motion + Tailwind CSS
- 📚 **知識ベース連携**: 既存のVIBE知識管理システムと互換

## 🎯 デモ

![AI Assistant Demo](./docs/demo.gif)

## 🚀 クイックスタート

### 前提条件

- Node.js 18+ 
- npm または yarn
- (オプション) Claude Code CLI

### インストール

```bash
# テンプレートをクローン
git clone https://github.com/your-username/vibe-ai-template.git
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
3. **3つのタブ**: チャット・分析・設定がすぐに利用可能

## 🔧 使い方

### チャット機能

```
質問例:
- "React コンポーネントを作成して"
- "TypeScript の型定義を教えて"  
- "API エンドポイントの例を見せて"
```

### コード分析機能

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

### 設定

- **AIモデル選択**: Haiku（高速）/ Sonnet（バランス）/ Opus（高性能）
- **動作設定**: 自動分析、リアルタイムヘルプ等
- **オフライン機能**: ローカル分析の利用

## 📦 含まれているもの

### 🎯 AI機能
- **AIService**: Claude Code SDK ラッパー
- **コード分析**: 品質チェック・改善提案
- **チャット**: インタラクティブなAI対話
- **設定管理**: カスタマイズ可能な動作設定

### 🧩 UIコンポーネント
- **AIFloatingButton**: フローティングアクションボタン
- **AIPanel**: メインのAIインターフェース
- **CodeAnalyzer**: コード分析UI
- **ChatInterface**: チャットUI
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
│   │   ├── AIPanel.tsx      # AIパネル
│   │   ├── CodeAnalyzer.tsx # コード分析
│   │   ├── ChatInterface.tsx # チャット
│   │   └── AISettings.tsx   # 設定
│   ├── hooks/ai/           # AI関連フック
│   │   └── useAIService.ts  # AIサービスフック
│   ├── services/           # サービスレイヤー
│   │   └── aiService.ts     # AIサービスクラス
│   ├── types/              # 型定義
│   │   └── ai.ts           # AI関連型
│   └── App.tsx             # メインアプリ
├── .ai/                    # VIBE知識管理（継承）
└── package.json            # 依存関係
```

## 🤖 AI機能の詳細

### サポート機能

| 機能 | オンライン | オフライン | 説明 |
|------|-----------|-----------|------|
| コード分析 | ✅ 高精度 | ✅ 基本 | 品質チェック・改善提案 |
| コード生成 | ✅ 高品質 | ✅ テンプレート | AIによるコード生成 |
| チャット | ✅ 対話的 | ✅ 基本応答 | 質問・相談・学習 |
| 知識検索 | ✅ 統合 | ✅ ローカル | プロジェクト知識ベース |

### モデル選択

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
// Tailwind CSS クラスで簡単にスタイル変更
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

1. Fork this repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📝 ライセンス

[MIT License](./LICENSE)

## 🙏 謝辞

- [Claude Code SDK](https://github.com/instantlyeasy/claude-code-sdk-ts) - AI機能の基盤
- [VIBE Coding Template](https://github.com/your-username/vibe-coding-template) - 元となるテンプレート
- [React](https://react.dev/) - UIフレームワーク
- [Vite](https://vitejs.dev/) - ビルドツール

## 📞 サポート

- **Issues**: [GitHub Issues](https://github.com/your-username/vibe-ai-template/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/vibe-ai-template/discussions)
- **Documentation**: [Wiki](https://github.com/your-username/vibe-ai-template/wiki)

---

**🎉 Happy Coding with AI! 🤖**

このテンプレートで、AIと協働する新しい開発体験をお楽しみください。