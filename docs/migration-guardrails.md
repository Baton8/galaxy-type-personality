# 移行ガードレール（ロジック固定範囲）

このドキュメントは、先方テンプレートへの移行時に壊してはいけない診断ロジックを明文化したものです。

## 対象範囲

- 設問選定: `src/lib/question-selector.ts`
- 採点・判定: `src/lib/diagnosis.ts`
- データ前提: `src/data/questions.ts`, `src/data/type-results.ts`

## 固定した不変条件（Contract）

### 設問選定

- `selectQuestions()` は `totalQuestions`（現状10問）を返す
- 返却設問IDは重複しない
- 先頭5問で5軸（思慮/アプローチ/接客スタンス/アウトプット/対応スタイル）を網羅する
- 出題形式（接客シチュエーション/間接質問）の偏りは最終的に1問以内

### 採点・判定

- `calculateTypeScores()` は常にタイプID `1..8` の8件を返す
- 未知の回答ラベルは加点対象にしない（無視する）
- 正規化スコアは `rawScore / appearances`（`appearances = 0` は `0`）
- `determineWinnerType()` のタイブレーク順は以下
  1. `normalizedScore` 降順
  2. `rawScore` 降順
  3. `typeId` 昇順
- `determineWinnerType([])` は `1` を返す
- `resolveTypeResult()` は不正ID時にタイプ `7`（バランス型）へフォールバックする
- `diagnoseAnswers()` の `winnerTypeId` と `result.id` は整合する

## 検証方法

移行中は最低でも以下を実行してください。

```bash
bun --bun run test -- src/lib/migration-guardrails.test.ts
```

最終確認では既存テストを含めて実行してください。

```bash
bun --bun run test -- src/lib/question-selector.test.ts src/lib/diagnosis.test.ts src/lib/migration-guardrails.test.ts
```
