# AGENTS

このリポジトリで作業するエージェント向けの簡易ガイドです。
TanStack React Start + Vite + Tailwind CSS + Biome + Vitest を使用。
SSRが有効なのでブラウザAPIは必ずガードしてください。

## コマンド

### セットアップ
- bun install

### 開発/ビルド
- bun --bun run dev  # http://localhost:3000
- bun --bun run build
- bun --bun run preview
- bun --bun run deploy  # build -> wrangler deploy

### リント/フォーマット
- bun --bun run lint
- bun --bun run format
- bun --bun run check  # lint + format
- 単一ファイルの整形: bun --bun run format -- src/path/to/file.tsx
- 単一ファイルのlint: bun --bun run lint -- src/path/to/file.tsx

### テスト (Vitest)
- bun --bun run test
- 単一ファイル: bun --bun run test -- src/foo.test.tsx
- 単一テスト名: bun --bun run test -- -t "name pattern"
- 変更監視: bun --bun run test -- --watch
- UIランナー: bun --bun run test -- --ui

### コマンド例
```bash
bun --bun run test -- src/routes/result/$typeId.test.tsx
bun --bun run test -- -t "診断"
bun --bun run lint -- src/state/quiz.tsx
```

### Browser Automation
Use `agent-browser` for web automation. Run `agent-browser --help` for all commands.

Core workflow:
1. `agent-browser open <url>` - Navigate to page
2. `agent-browser snapshot -i` - Get interactive elements with refs (@e1, @e2)
3. `agent-browser click @e1` / `fill @e2 "text"` - Interact using refs
4. Re-snapshot after page changes

## コードスタイル

### フォーマット/リンティング
- Biomeが正。設定は `biome.json` を参照。
- インデントはタブ。
- 文字列はダブルクォート (Biome設定)。
- import整理はBiomeに任せる (.vscode/settings.json)。
- Biome対象外: `src/routeTree.gen.ts`, `src/styles.css`。

### インポート
- 基本順序: 外部 → 内部(@/...) → 相対。
- type-onlyは `import { type Foo }` を使う。
- `@/…` は `src` へのパスエイリアス。
- ルートファイル内のCSSは `../styles.css?url` のようにURLで読み込む。

### TypeScript/型
- strict 有効 (tsconfig)。
- 未使用の変数/引数は禁止 (noUnusedLocals/Parameters)。
- 副作用のみのimportは禁止 (noUncheckedSideEffectImports)。
- 形のあるデータは interface、ユニオンは type を優先。
- map/辞書は `Record<number, number>` など明示的に型付け。
- 型推論に頼り過ぎず、公開APIは戻り値型を明記。

### 命名
- Reactコンポーネントは PascalCase。
- 関数/変数は camelCase。
- 定数は必要に応じて UPPER_SNAKE_CASE。
- ルートファイルは `src/routes` 配下で `Route` を export。
- 生成物 `src/routeTree.gen.ts` は編集しない。

### React/Router
- ルートは `createFileRoute` / `createRootRoute`。
- ルートパラメータは `Route.useParams()` で取得。
- 遷移は `useNavigate` を使い、型安全なparamsを渡す。
- 画面ごとに `main` を持ち、`max-w-*` で幅を揃える傾向。

### SSR/ブラウザAPI
- `window`/`document`/`navigator` は必ず存在確認。
- 例: `typeof window !== "undefined"` / `typeof navigator !== "undefined"`。
- クライアント限定処理は `useEffect` で実行。
- 共有データの永続化は try/catch で安全に。

### エラーハンドリング
- null/undefined は早期returnでガード。
- Context未提供は明示的に throw (例: `useQuiz`)。
- 外部API/Storage/Shareは存在確認と例外処理。
- 失敗時はUIを壊さずフォールバックを返す。

### 状態管理
- 共有状態は Context + useReducer を基本形。
- 派生値は `useMemo` にまとめ、依存配列は正確に。
- セッション保存は小さく、構造を変える場合は移行を考慮。

### データ/ドメイン
- 質問/結果などの静的データは `src/data` に集約。
- 計算ロジックは `src/lib` に集約。
- IDは number で統一し、配列順と表示順を揃える。
- 変更時は `totalQuestions` など派生値を更新。

### スタイル
- Tailwind CSS を基本に使う。
- 既存のユーティリティ (surface-panel, accent-gradient, soft-outline, axis-grid) を再利用。
- 配色やフォントは `src/styles.css` のCSS変数に合わせる。
- 既存の日本語UI文言はトーン/語彙を合わせる。
- Biomeが見ない `src/styles.css` は手動で整える。

### テスト
- Vitest + Testing Library を想定。
- テスト名は日本語でも可。読みやすさ優先。
- 画面単位のテストは対応する `src/routes` 近くに置く。
- ユーティリティは `src/lib` と同じ階層に置く。

## 作業フロー (推奨)
- 目的に合う既存UI/ロジックを先に探す。
- ルート/状態/データの変更範囲を最小化する。
- 変更後は `bun --bun run check` で静的検証。
- 必要なら `bun --bun run test -- <file>` で単体確認。
- 生成物やデモは不用意に編集しない。

## 変更時の注意
- OGP/共有URLの基底URLは `src/routes/result/$typeId.tsx` で定義。
- SSR前提なので副作用はクライアントに閉じる。
- ルート追加時は `src/routes` に新規ファイルを置く。
- path alias 変更時は `tsconfig.json` と `vite.config.ts` を同期。

## ファイル/ディレクトリの注意点
- `src/routes`: ファイルベースルーティング。動的パスは `$param`。
- `src/routes/demo`: READMEの通りサンプル。不要なら削除可。
- `src/routeTree.gen.ts`: 自動生成。編集禁止。
- `src/styles.css`: グローバルスタイル。Biome対象外。
- `public/`: OGPやfavicon等の静的アセット。

## Cursor/Copilot ルール
- .cursorrules / .cursor/rules/ / .github/copilot-instructions.md は存在しない。

## 参考ファイル
- package.json: scripts/依存関係
- biome.json: フォーマット/リント
- tsconfig.json: 型/strict設定
- vite.config.ts: Vite/TanStack Start/Cloudflare設定
- src/routes/__root.tsx: HTMLシェル/メタ情報
- src/state/quiz.tsx: 状態管理
- src/lib/diagnosis.ts: 診断ロジック
- src/data/questions.ts: 設問データ
- src/data/type-results.ts: 結果データ
- src/styles.css: デザイン基盤
