# Vue3 + Hono + AI SDK チャットアプリ

Vue3、Hono、AI SDKを使用したリアルタイムストリーミングチャットアプリケーション。UIMessage形式のサポートとライブデバッグパネルを搭載しています。

## 特徴

- **リアルタイムストリーミング**: AI SDKのストリーミング機能を使用した1文字ずつのAI応答
- **UIMessage形式**: `parts`配列を持つAI SDKのUIMessage構造を完全サポート
- **デバッグパネル**: UIMessageの完全な構造をリアルタイムで表示するライブJSONビューア
- **モダンスタック**: Composition APIを使用したVue3、バックエンドはHono、OpenAI GPT-4o-mini
- **TypeScript**: 完全な型定義による優れた開発体験
- **2カラムレイアウト**: 左側にチャットインターフェース、右側にデバッグパネル

## スクリーンショット

### チャットインターフェースとデバッグパネル

![Chat with Debug Panel](screenshots/chat-with-debug-panel.png)

アプリケーションは分割画面レイアウトを採用：
- **左側**: 美しいグラデーションスタイルのチャットインターフェース
- **右側**: UIMessageのJSON構造を表示するVS Codeスタイルのダークテーマデバッグパネル

デバッグパネルには以下が表示されます：
- リアルタイムのメッセージ数
- 完全なUIMessage構造：
  - テキストとメタデータを含む`parts`配列
  - ストリーミング状態（`step-start`、`done`）
  - プロバイダーメタデータ（OpenAI item ID）
  - メッセージIDとロール

## 技術スタック

- **フロントエンド**: Vue3, TypeScript, Vite
- **バックエンド**: Hono（軽量Webフレームワーク）
- **AI**: AI SDK (@ai-sdk/vue, @ai-sdk/openai)
- **モデル**: OpenAI GPT-4o-mini

## 必要要件

- Node.js 18以上
- OpenAI APIキー

## インストール

1. リポジトリをクローン：
```bash
git clone https://github.com/wadakatu/vue-hono-aisdk-chat.git
cd vue-hono-aisdk-chat
```

2. 依存関係をインストール：
```bash
npm install
```

3. ルートディレクトリに`.env`ファイルを作成し、OpenAI APIキーを追加：
```env
OPENAI_API_KEY=your_api_key_here
```

## 使い方

1. 開発サーバーを起動：
```bash
npm run dev
```

以下のサーバーが起動します：
- **フロントエンド (Vite)**: http://localhost:5173
- **バックエンド (Hono)**: http://localhost:3001

2. ブラウザで http://localhost:5173 を開く

3. AIとのチャットを開始！右側のデバッグパネルでUIMessage構造をリアルタイムで確認できます。

## プロジェクト構造

```
vue-hono-aisdk-chat/
├── src/
│   ├── client/           # Vue3フロントエンド
│   │   ├── App.vue       # チャットUIとデバッグパネルを含むメインコンポーネント
│   │   ├── main.ts       # Vueアプリのエントリーポイント
│   │   └── style.css     # グローバルスタイル
│   └── server/           # Honoバックエンド
│       └── index.ts      # APIエンドポイントとストリーミングロジック
├── index.html            # HTMLエントリーポイント
├── vite.config.ts        # プロキシ設定を含むVite設定
├── tsconfig.json         # TypeScript設定
└── package.json          # 依存関係とスクリプト
```

## 実装の詳細

### UIMessage構造

このアプリケーションは、チャットメッセージに対してリッチな構造を提供するAI SDKのUIMessage形式を使用しています：

```typescript
{
  "id": "unique-id",
  "role": "user" | "assistant",
  "parts": [
    {
      "type": "text",
      "text": "Message content",
      "state": "done",
      "providerMetadata": { ... }
    }
  ]
}
```

### サーバー側の変換

サーバーは`convertToModelMessages()`を使用してUIMessage[]をModelMessage[]に変換します：

```typescript
// src/server/index.ts
const { messages } = await c.req.json()
const modelMessages = convertToModelMessages(messages)

const result = streamText({
  model: openai('gpt-4o-mini'),
  messages: modelMessages,
})

return result.toUIMessageStreamResponse()
```

### クライアント側のChatクラス

フロントエンドは`@ai-sdk/vue`のChatクラスをリアクティブな状態管理に使用します：

```typescript
import { Chat } from '@ai-sdk/vue'

const chat = new Chat({
  api: '/api/chat',
  messages: []
})

// Send message
chat.sendMessage({ text: message })
```

## 開発

### 利用可能なスクリプト

- `npm run dev` - フロントエンドとバックエンドの両方を開発モードで起動
- `npm run dev:client` - Vite開発サーバーのみを起動
- `npm run dev:server` - Honoサーバーのみを起動

### APIエンドポイント

- `POST /api/chat` - UIMessage形式を使用してチャット応答をストリーミング

## 環境変数

以下の内容で`.env`ファイルを作成してください：

```env
OPENAI_API_KEY=your_openai_api_key
```

## コントリビューション

コントリビューションを歓迎します！お気軽にPull Requestを送ってください。

## ライセンス

MIT

## 謝辞

[Claude Code](https://claude.com/claude-code)で構築
