# 🤖 Vibe AI Integrated Template

![Development Status](https://img.shields.io/badge/Status-Phase%203%20Development-blue)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)
![Anthropic](https://img.shields.io/badge/Claude%20API-Integrated-green)

AI機能が統合された次世代の開発テンプレートです。Claude APIとの実際の統合により、ブラウザ上で本格的なAI開発体験を提供します。

## ✨ Phase 3 の新機能

### 🔗 実際のClaude API統合
- **実際のAnthropicのClaude API**との統合
- **APIキー管理**と設定UI
- **3つのClaudeモデル**対応（Haiku、Sonnet、Opus）
- **レート制限対応**と使用統計表示

### 📁 ファイルシステム統合
- **File System Access API**対応
- **プロジェクトディレクトリ**の選択と管理
- **リアルタイムファイル監視**（ポーリング方式）
- **プロジェクト構造の自動スキャン**

### 🧠 強化されたAI機能
- **プロジェクトコンテキスト**を活用した分析
- **知識ベースの自動学習**機能
- **高度なフォールバック**システム
- **統合ヘルスチェック**

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- 対応ブラウザ (Chrome 86+, Edge 86+, Firefox 90+)
- **Claude API Key** (Anthropic Consoleから取得)

### Installation

```bash
# リポジトリをクローン
git clone https://github.com/kirikab-27/vibe-ai-template.git
cd vibe-ai-template

# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev
```

### Claude API設定

1. [Anthropic Console](https://console.anthropic.com/)でAPIキーを取得
2. アプリケーションの「API」タブでキーを設定
3. 接続テストを実行
4. AI機能が利用可能になります

## 📋 機能一覧

### 🗨️ AIチャット
- Claude APIによる高精度な応答
- プロジェクトコンテキストを含む対話
- プリセットプロンプト
- チャット履歴管理

### 🔍 コード分析
- **実際のClaude API**による詳細分析
- TypeScript/React特化の検証
- 複雑度計算と品質評価
- **プロジェクト全体を考慮**した提案

### 📚 知識ベース
- **自動学習機能**付き知識管理
- 分析結果の自動記録
- スマート検索とフィルター
- カテゴリ別整理

### 📁 ファイルシステム統合
- **ブラウザから直接ファイルアクセス**
- プロジェクト構造の可視化
- ファイル変更の監視
- 統計情報の表示

### ⚙️ API設定
- Claude APIキーの安全な管理
- モデル選択（Haiku/Sonnet/Opus）
- パラメータ調整（Temperature、Max Tokens）
- 使用統計とレート制限表示

### 🔧 高度な設定
- ホットキーカスタマイズ
- プライバシー設定
- オフライン動作の制御
- パフォーマンス調整

## ⌨️ ホットキー

| ショートカット | 機能 |
|---|---|
| `Cmd/Ctrl + K` | AIアシスタント起動 |
| `Cmd/Ctrl + Shift + C` | チャット直接起動 |
| `Cmd/Ctrl + Shift + A` | コード分析直接起動 |
| `Escape` | パネルを閉じる |
| `Cmd/Ctrl + ?` | ヘルプ表示 |

## 🏗️ 開発段階

### ✅ Phase 1 (完了)
- [x] 基本AI統合システム
- [x] UIコンポーネント群
- [x] ホットキーシステム
- [x] 基本知識ベース

### ✅ Phase 2 (完了)
- [x] ファイルコンテキスト統合
- [x] 知識ベース強化
- [x] 4タブインターフェース
- [x] プロジェクト統計

### 🔄 Phase 3 (進行中)
- [x] **Claude API実装**
- [x] **File System Access API**
- [x] **実際のファイル監視**
- [x] **プロジェクトコンテキスト強化**
- [x] **API設定UI**

### 🎯 Phase 4 (予定)
- [ ] エディタ連携（VS Code Extension）
- [ ] リアルタイムコラボレーション
- [ ] 複数AI プロバイダー対応
- [ ] チーム機能

### 🚀 Phase 5 (予定)
- [ ] プロダクションデプロイ対応
- [ ] 企業向け機能
- [ ] プラグインシステム
- [ ] マーケットプレイス

## 🛠️ 技術スタック

### Core
- **React 18.2.0** - UIフレームワーク
- **TypeScript 5.0+** - 型安全性
- **Vite** - 高速ビルドツール

### AI Integration
- **@anthropic-ai/sdk** - Claude API client
- **実際のClaude API** - Haiku/Sonnet/Opus
- **カスタムフォールバックシステム**

### UI/UX
- **Framer Motion** - アニメーション
- **Lucide React** - アイコン
- **カスタムCSS** - スタイリング

### Advanced Features
- **File System Access API** - ブラウザファイルアクセス
- **React Hotkeys Hook** - キーボードショートカット
- **ローカルストレージ** - 設定の永続化

## 🔐 セキュリティ

### APIキー管理
- ブラウザのローカルストレージに暗号化保存
- セッション終了時の自動クリア（オプション）
- セキュリティ警告の表示

### プライバシー
- データはローカルで処理
- API通信のみクラウド送信
- ユーザー制御のデータ共有

## 🌐 ブラウザサポート

| ブラウザ | File System API | Claude API | 総合サポート |
|---|---|---|---|
| Chrome 86+ | ✅ | ✅ | **フル機能** |
| Edge 86+ | ✅ | ✅ | **フル機能** |
| Firefox 90+ | ⚠️ 制限あり | ✅ | **基本機能** |
| Safari | ❌ | ✅ | **API機能のみ** |

## 📊 Phase 3 実装状況

| 機能カテゴリ | 実装状況 | 説明 |
|---|---|---|
| **Claude API統合** | ✅ **実装済み** | 実際のAnthropic APIとの統合 |
| **APIキー管理** | ✅ **実装済み** | 安全な保存と設定UI |
| **ファイルシステム** | ✅ **実装済み** | File System Access API対応 |
| **プロジェクト監視** | ✅ **実装済み** | ポーリングベースの変更検出 |
| **知識学習** | ✅ **実装済み** | 分析結果の自動記録 |
| **統合分析** | ✅ **実装済み** | プロジェクト全体を考慮 |

## 🔄 制限事項（Phase 3時点）

### 技術的制限
- File System Access APIは**Chrome系ブラウザのみフル対応**
- ファイル監視は**ポーリング方式**（ネイティブwatcherなし）
- **Claude API使用料金**が発生します

### 開発中の機能
- エディタとの直接連携は**Phase 4**で実装予定
- チームコラボレーション機能は**Phase 4**で実装予定
- 複数AI プロバイダーは**Phase 4**で実装予定

## 🤝 Contributing

### 開発への参加

```bash
# 開発環境のセットアップ
git clone https://github.com/kirikab-27/vibe-ai-template.git
cd vibe-ai-template
npm install
npm run dev

# 新機能の開発
git checkout -b feature/your-feature
# 変更を実装
git commit -m "feat: your feature description"
git push origin feature/your-feature
```

### 問題報告
- バグレポートは[Issues](https://github.com/kirikab-27/vibe-ai-template/issues)まで
- 機能要望も歓迎します
- セキュリティ問題は非公開でご連絡ください

## 📋 ロードマップ

### 2025年Q1-Q2
- [x] Phase 1-2: 基盤システム構築
- [x] **Phase 3: Claude API統合** ⭐ **現在**

### 2025年Q3
- [ ] Phase 4: エディタ連携とチーム機能
- [ ] VS Code Extension開発
- [ ] 複数AI プロバイダー対応

### 2025年Q4
- [ ] Phase 5: エンタープライズ機能
- [ ] プロダクション最適化
- [ ] マーケットプレイス機能

## 📄 ライセンス

MIT License - 詳細は[LICENSE](LICENSE)をご覧ください。

## 🆘 サポート

### ドキュメント
- [セットアップガイド](docs/setup.md)
- [API リファレンス](docs/api.md)
- [開発ガイド](docs/development.md)

### コミュニティ
- [Discussions](https://github.com/kirikab-27/vibe-ai-template/discussions) - 質問・議論
- [Issues](https://github.com/kirikab-27/vibe-ai-template/issues) - バグ報告・機能要望

### 開発チーム
- [@kirikab-27](https://github.com/kirikab-27) - メイン開発者

---

⭐ **Phase 3 では実際のClaude APIとの統合により、本格的なAI開発体験を提供します！**

**最終更新**: 2025-01-26 | **Phase**: 3.0 | **Status**: Active Development