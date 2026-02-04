# CLAUDE.md (Legacy - X/Y軸ベース診断)

> **注意**: このドキュメントは旧診断ロジック（X/Y軸ベース）の説明です。
> 現行の実装はタイプ別スコア加算方式に変更されています。
> 最新の仕様は `/CLAUDE.md` を参照してください。

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

販売員タイプ診断アプリ - TanStack React Start + Vite + Tailwind CSS + Biome + Vitest。
SSRが有効なのでブラウザAPIは必ずガードすること。

## コマンド

```bash
# セットアップ
bun install

# 開発/ビルド
bun --bun run dev      # http://localhost:3000
bun --bun run build
bun --bun run deploy   # build -> wrangler deploy

# リント/フォーマット
bun --bun run check                            # format + lint
bun --bun run format -- src/path/to/file.tsx   # 単一ファイル整形
bun --bun run lint -- src/state/quiz.tsx       # 単一ファイルlint

# テスト
bun --bun run test                             # 全テスト
bun --bun run test -- src/foo.test.tsx         # 単一ファイル
bun --bun run test -- -t "診断"                # パターンマッチ
bun --bun run test -- --watch                  # 変更監視
```

## アーキテクチャ（旧）

診断フロー全体像:
```
ユーザー回答 → 軸スコア計算 → 最近傍タイプ判定 → 結果表示
```

### データ層 (`src/data/`)
- `questions.ts`: 設問データ。各設問は X軸 or Y軸 に属し、`positiveDirection` で加算方向を決定
- `type-results.ts`: 8タイプの結果データ（名称、説明、OGP画像URL等）
- 設問追加/削除時は `totalQuestions` など派生値を更新

### ロジック層 (`src/lib/`)
- `diagnosis.ts`: 診断の核心部分
  - `calculateAxisScores()`: 回答から X/Y 軸スコアを算出
  - `determineTypeId()`: ユークリッド距離で最近傍タイプを判定
  - `typeCentroids`: 8タイプの座標定義（チューニング対象）
- IDは number で統一し、配列順と表示順を揃える

### 状態層 (`src/state/`)
- `quiz.tsx`: Context + useReducer パターン。`QuizProvider` で全体をラップ
  - 回答状態を sessionStorage に永続化
  - `useQuiz()` で state/dispatch/派生値を取得
  - Context未提供時は明示的に throw
- 派生値は `useMemo` にまとめ、依存配列は正確に
- セッション構造を変える場合は移行を考慮

### ルート層 (`src/routes/`)
- ファイルベースルーティング。動的パスは `$param`
- `__root.tsx`: HTMLシェル、Provider階層、メタ情報
- `quiz/$questionId.tsx`: 設問画面。回答後に次へ遷移 or 完了画面へ
- `result/$typeId.tsx`: 結果画面。OGP/共有URL生成
- ルートは `createFileRoute` / `createRootRoute` で定義し `Route` を export
- ルートパラメータは `Route.useParams()` で取得
- 遷移は `useNavigate` を使い、型安全なparamsを渡す

## コードスタイル

- Biomeが正（`biome.json`）。インデントはタブ、文字列はダブルクォート
- `@/…` は `src` へのパスエイリアス
- type-only は `import { type Foo }` を使う
- 副作用のみのimportは禁止 (noUncheckedSideEffectImports)
- ルートファイル内のCSSは `../styles.css?url` のようにURLで読み込む

### SSR/ブラウザAPI（重要）
SSRで壊れる処理は早期returnかガードで回避:
```typescript
// ガード例
if (typeof window === "undefined") return;
if (typeof navigator === "undefined") return null;

// クライアント限定処理は useEffect 内で
useEffect(() => {
  // ここでのみ window/document/navigator を使用
}, []);

// Storage/Share は try/catch で安全に
try {
  sessionStorage.setItem(key, value);
} catch {
  // SSRやプライベートモードで失敗しても継続
}
```

### エラーハンドリング
- null/undefined は早期returnでガード
- 外部API/Storage/Shareは存在確認と例外処理
- 失敗時はUIを壊さずフォールバックを返す

### スタイル
- Tailwind CSS + カスタムユーティリティ (`surface-panel`, `accent-gradient`, `soft-outline`, `axis-grid`)
- 配色/フォントは `src/styles.css` のCSS変数参照
- 既存の日本語UI文言はトーン/語彙を合わせる

## 編集禁止・注意ファイル

| ファイル | 理由 |
|---------|------|
| `src/routeTree.gen.ts` | 自動生成。編集禁止 |
| `src/styles.css` | Biome対象外。手動で整える |
| `src/routes/demo/` | サンプル。不要なら削除可 |

## 変更時の注意

- path alias 変更時は `tsconfig.json` と `vite.config.ts` を同期
- OGP/共有URLの基底URLは `src/routes/result/$typeId.tsx` で定義
- 変更後は `bun --bun run check` で静的検証
