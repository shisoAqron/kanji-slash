# かんじスラッシュ

小学生が熟語の読み方を二択で学ぶ、スマートフォン向けの漢字学習ゲームです。
正しい読み方を持つ妖怪を選び、刀の斬撃アニメーションで退治します。

詳細な仕様は [Agents.md](./Agents.md) を参照してください。

## 必要環境

- Node.js 24 以降
- npm

## ローカル起動

```bash
npm install
npm run dev
```

`http://localhost:5173` で起動します。

## テスト

```bash
npm run test
```

Vitest によるユニットテストと、`public/data/questions/` 以下のスキーマ検証テストを実行します。

## ビルド

```bash
npm run build
```

`tsc -b` による型チェックの後、`dist/` に静的ファイルを出力します。

```bash
npm run preview
```

でビルド成果物をローカル確認できます。

## 問題データの追加方法

問題は `public/data/questions/` 以下の学年別JSONで管理しています。コンポーネントへ直接記述する必要はありません。

1. `public/data/questions/manifest.json` で対象学年の `available` を `true` にし、`path` を設定する
2. `public/data/questions/grade-N.json`（N は学年）に問題を追加する。各問題は以下の形式です。

   ```json
   {
     "id": "g1-013",
     "word": "青空",
     "reading": "あおぞら",
     "distractors": ["せいくう", "あおそら"],
     "example": "青空が きれいだ。",
     "exampleReading": "あおぞらが きれいだ。",
     "kanjiGrades": { "青": 1, "空": 1 },
     "tags": ["訓読み", "連濁"]
   }
   ```

3. `id` は全問題で一意にする
4. `word` は対象学年以下の配当漢字のみで構成し、必ず二文字以上にする（配当漢字一覧は `src/data/kanji-by-grade.json`）
5. `distractors` は最低1件、正解の読みと重複しないひらがなにする
6. 追加後は `npm run test` を実行し、スキーマ検証・重複チェックが通ることを確認する

問題データの出典・作成方針は [Agents.md](./Agents.md) の「問題データの出典と作成方針」を参照してください。
本リポジトリの問題文はすべてオリジナル作成（`sourcePolicy: "original"`）ですが、実際の学習教材として使う前に国語辞典等で読みと別解の最終確認を行ってください。

## GitHub Pages への公開設定

1. リポジトリの Settings → Pages で、Source を **GitHub Actions** に設定する
2. `main` ブランチへ push すると `.github/workflows/deploy.yml` が実行され、テスト・ビルドを経て自動的にデプロイされる
3. `vite.config.ts` の `base` は GitHub Actions 実行時に自動でリポジトリ名のサブパス（`/kanji-slash/`）を使用する

## 参照アセットとライセンス

- 妖怪・エフェクト等の見た目はすべて本リポジトリ内でオリジナルに実装した CSS / SVG によるものです。外部の画像・イラスト素材は使用していません。
- `prototype-images/` はデザインの方向性を検討するための参照イメージであり、実装済みUIはその配色・レイアウトの傾向のみを抽出したオリジナル実装です（参照画像内の一文字問題の表示は旧案のため採用していません）。
- 効果音ファイルは未収録です。`src/hooks/useSound.ts` はON/OFF設定の保持のみを行い、音源を追加する際にライセンスを確認のうえ実装してください。
- 外部辞書・外部問題集のデータは使用していません。詳細は [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md) を参照してください。
- `public/card.png` は X（Twitter）・Discord等でリンクをシェアした際にカード表示されるOGP画像です。差し替える場合は `index.html` の `og:image` / `twitter:image` のURLとあわせて更新してください。

## ライセンス / License

本リポジトリは [MIT License](./LICENSE) で公開しています。ソースコード・問題データを問わず、商用・非商用を含めて自由に利用・改変・再配布できます（著作権表示とライセンス全文の同梱が必要です）。

This repository is released under the [MIT License](./LICENSE). You are free to use, modify, and redistribute the source code and question data, including for commercial purposes, as long as the copyright notice and license text are included.

## ディレクトリ構成

```text
src/
├── app/            # アプリ全体の状態管理（画面遷移・ゲームセッション）
├── components/     # 共通・ゲーム・結果画面の各UI部品
├── screens/        # 画面単位のコンポーネント
├── domain/         # 問題データ・ゲームロジック・スコアリングの純粋関数
├── hooks/          # データ読み込み・音・reduced motionなどの副作用フック
├── data/           # 学年別配当漢字一覧（検証用）
└── styles/         # デザイントークン・グローバルCSS・アニメーション定義

public/data/questions/  # 学年別の問題JSONとマニフェスト
```
