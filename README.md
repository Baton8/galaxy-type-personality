# Galaxy Type Personality

販売員タイプ診断アプリ。8つの銀河タイプから自分の販売スタイルを発見できます。

## 技術スタック

- **フレームワーク**: TanStack React Start + Vite
- **スタイリング**: Tailwind CSS
- **リント/フォーマット**: Biome
- **テスト**: Vitest
- **デプロイ**: Cloudflare Workers

## 開発

```bash
# セットアップ
bun install

# 開発サーバー起動 (http://localhost:3000)
bun --bun run dev

# ビルド
bun --bun run build

# デプロイ
bun --bun run deploy
```

## コード品質

```bash
# リント + フォーマット
bun --bun run check

# テスト実行
bun --bun run test
```

## テンプレート移行時の確認

移行時に壊してはいけないロジックの固定範囲は以下を参照してください。

- `docs/migration-guardrails.md`
