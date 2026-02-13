# Migration Plan

## 目的
TanStack Start で構築した診断アプリを、`mobile-special-20240719` の制作パッケージ準拠の納品形式（PC/SP別HTML）へ移行する。

## 参照元
- テンプレート: `/Users/voq/Developer/work/vildas/galaxy-type-personality/mobile-special-20240719/wwwroot/mobile/special/special-page/index.html`
- テンプレート(SP): `/Users/voq/Developer/work/vildas/galaxy-type-personality/mobile-special-20240719/wwwroot/mobile/special/special-page/index_i.html`
- 制作要件: `/Users/voq/Developer/work/vildas/galaxy-type-personality/mobile-special-20240719/ソフトバンクサービスサイト_制作パッケージ.md`
- 現行ロジック固定範囲: `/Users/voq/Developer/work/vildas/galaxy-type-personality/docs/migration-guardrails.md`

## 前提・制約（要件から抽出）
- 編集可能なのは原則 `ページ情報` / `LOCAL IMPORT` / `本文` の編集可コメント範囲のみ。
- ヘッダー/フッター/パンくずなどの共通領域は編集しない。
- PC版とSP版は別HTML（`index.html` / `index_i.html`）で納品。
- 参照パスは原則サイトルート起点（`/mobile/...`）。
- URL末尾は `/`（`index.html` 直リンクを作らない）。
- ディレクトリ名は小文字英数字 + `-`、ファイル名は小文字英数字 + `-`/`_`。
- 同一フォルダ内で拡張子違い同名ファイルを作らない。

## 移行方針
- フロント基盤は作り直し（React/SSR前提を捨て、テンプレートHTML準拠へ）。
- 診断ロジックは現行実装を再利用し、挙動をテストで固定して移植する。
- 編集可能領域に閉じるため、ページ実装は「本文に描画する単一ルート要素配下」に限定する。

## 作業ステップ
1. 受け皿ディレクトリ作成
- `{page}` を確定（例: `galaxy-type`）。
- 以下を作成。
  - `/mobile/special/{page}/index.html`
  - `/mobile/special/{page}/index_i.html`
  - `/mobile/set/data/special/{page}/css/p/`
  - `/mobile/set/data/special/{page}/css/s/`
  - `/mobile/set/data/special/{page}/css/shared/`
  - `/mobile/set/data/special/{page}/js/p/`
  - `/mobile/set/data/special/{page}/js/s/`
  - `/mobile/set/data/special/{page}/js/shared/`
  - `/mobile/set/data/special/{page}/img/p/`
  - `/mobile/set/data/special/{page}/img/s/`
  - `/mobile/set/data/special/{page}/img/shared/`

2. テンプレートの複製
- `special-page/index.html`, `special-page/index_i.html` を `{page}` へコピー。
- 編集可領域以外は変更しない。

3. メタ情報整備
- `title`, `description`, `keywords`, `og:*` を案件値へ置換。
- 必要なら canonical を `https://` 絶対パスで追加（許可領域のみ）。

4. 診断ロジックの移植
- 現行の以下を `js/shared/` に移植。
  - 設問データ（`src/data/questions.ts`）
  - 結果データ（`src/data/type-results.ts`）
  - 採点/勝者判定（`src/lib/diagnosis.ts`）
  - 設問選定（`src/lib/question-selector.ts`）
- 型依存（TypeScript）を外し、ブラウザ実行可能なJavaScriptへ変換。
- セッション保持は `sessionStorage` を利用（失敗時フォールバック実装）。

5. UI実装（本文領域のみ）
- 本文内に親要素を1つ定義（例: `<div id="galaxy-type-app"></div>`）。
- その配下に質問・回答・結果表示UIを実装。
- PC/SPで必要に応じて別CSSを読み分け。
- 既存共通要素へ影響しないよう、必ず `#galaxy-type-app` 配下限定でスタイル適用。

6. 画像・OGP・リンク調整
- 画像を `img/p`, `img/s`, `img/shared` に配置。
- OGP画像は `https://www.softbank.jp/...` の絶対パスで設定。
- 内部リンクは `/mobile/.../` 形式へ統一。

7. 検証
- ロジック契約テストを現行リポジトリでパスさせる。
  - `bun --bun run test -- src/lib/migration-guardrails.test.ts`
- テンプレート成果物側は以下を手動確認。
  - コンソールエラーなし
  - 404なし
  - HTML構文エラーなし
  - PC/SP表示崩れなし
  - 必須領域（ヘッダー/フッター/パンくず）非改変

8. 納品物作成
- 初回納品: ファイル一式 / 納品ファイルリスト / 品質管理シート。
- 再納品: 常に全量 + 差分ファイルリスト + 品質管理シート。

## マッピング（現行 -> 納品実装）
- `src/data/questions.ts` -> `js/shared/questions.js`
- `src/data/type-results.ts` -> `js/shared/type-results.js`
- `src/lib/diagnosis.ts` -> `js/shared/diagnosis.js`
- `src/lib/question-selector.ts` -> `js/shared/question-selector.js`
- `src/state/quiz.tsx` -> `js/shared/app-state.js`
- `src/routes/quiz/$questionId.tsx`, `src/routes/result/$typeId.tsx` -> `js/shared/app-ui.js`

## 完了条件（Definition of Done）
- テンプレート規約違反がない（編集不可領域を変更していない）。
- 診断ロジックの結果が現行仕様と一致する（ガードレール準拠）。
- PC/SPの納品HTMLで動作し、リンク/パス/命名ルールを満たす。
- 納品ファイルリストと品質管理シートの記載が完了している。

## リスクと対策
- リスク: React依存実装のまま持ち込むとCMS反映対象外になる。
- 対策: 本文+LOCAL IMPORTだけで完結する素のHTML/CSS/JS構成に限定。

- リスク: 既存スタイルへ干渉してヘッダー/フッター表示崩れが起きる。
- 対策: `#galaxy-type-app` 起点のスコープ付きCSSのみ使用。

- リスク: URL/パス規約違反で差し戻し。
- 対策: 納品前に「末尾スラッシュ」「サイトルート起点」「OGPのみ絶対パス」を一括チェック。
