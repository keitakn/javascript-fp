# 第2章 関数型言語としてのJavaScript

## なぜJavaScriptで関数型を学ぶのか

書籍にも書いてあったが答えは至ってシンプルで、様々な場所で使われているから。

例えばHaskellは純粋な関数型言語と言われているがWeb開発だと圧倒的にJavaScriptが使われているケースが多い。

[Elm](http://elm-lang.org/) を使うかどうかも検討したが、関数型の設計に慣れないうちはまず慣れた言語でやってからのほうが学習でつまづきにくいのも理由の1つ。

実戦でもReactが関数型コンポーネントを推奨していたりするので活かす場面は十分にある。

## 関数型プログラミング vs オブジェクト指向プログラミング

比較すると下記の通りである。

|     | 関数型 | オブジェクト指向 |
|:----|:-----|:---|
| 合成の単位 | 関数 | オブジェクト（クラス） |
| プログラミングスタイル | 宣言型 | 命令型 |
| データと振る舞い | 純粋で独立した関数と緩い結合 | クラス内でメソッドと強い結合 |
| 状態管理 | オブジェクトを不変値として扱う | インスタンスメソッドを利用してオブジェクトの変更を行う |
| フロー制御 | 関数と再帰 | ループと条件分岐 |
| スレッド安全性 | 並列プログラミングが可能 | スレッドセーフは難しい |
| カプセル化 | 全てが不変のため不要 | データの整合性を保つために必要 |

「オブジェクトを不変値として扱う」に関しては最近はオブジェクト指向でもimmutableオブジェクトで作るのが主流になっている。

スレッドの安全性については並列プログラミングを行わないのであればそれほど恩恵は受けれない。

現時点ではフロントエンドが特に関数型の設計が有効だと個人的には思う。

## JavaScriptで不変オブジェクトを作る

`const` で宣言すれば変数の再代入を防ぐ事は可能だ。

しかし以下のようにプロパティの変更は可能なままだ。

```typescript
const originalAddress = {
  country: "JP",
  postalCode: "1000014",
  region: "東京都",
  locality: "千代田区",
  streetAddress: "永田町１丁目７−１"
};
originalAddress.country = "US";
```

解決策としては以下があげられる。

### [Object.freeze()](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze) を使う

フラット構造なオブジェクトならこれでイケる。

しかしオブジェクトが入れ子になっているとこれだけでは上手くいかない。

自前で `deepFreeze` みたいな感じの名前の再帰的に動作する関数を定義してあげる必要があるだろう。

### TypeScriptのreadonlyを利用する

オブジェクトのインターフェースを以下のように定義する。

```typescript
export interface IAddress {
  readonly country: string;
  readonly postalCode: string;
  readonly region: string;
  readonly locality: string;
  readonly streetAddress: string;
}
```

以下のコードはコンパイルが通らない。

```typescript
const originalAddress: IAddress = {
  country: "JP",
  postalCode: "1000014",
  region: "東京都",
  locality: "千代田区",
  streetAddress: "永田町１丁目７−１"
};
// Cannot assign to 'country' because it is a constant or a read-only property.
originalAddress.country = "US";
````

ただし、TypeScriptは型推論が可能である為、このように毎回型宣言を書かないケースも多い。

例えインターフェースで `readonly` で宣言しても以下のコードではコンパイルが通ってしまう。

```typescript
const originalAddress = {
  country: "JP",
  postalCode: "1000014",
  region: "東京都",
  locality: "千代田区",
  streetAddress: "永田町１丁目７−１"
};
originalAddress.country = "US";
```

コーディング規約で縛れば何とかなるかもだが、これも確実な方法とは言えないだろう。

### `Ramda.js` というライブラリを使う

[Ramda](https://ramdajs.com/) を利用する。

結論から言ってしまうとこれが最もオススメの方法ではないかと思う。

`assoc` や `lens` を利用して copy on write（書き込み時に古いオブジェクトをコピーする）を行い、元のオブジェクトが変更されないようにする。

これらの関数を通してオブジェクトの生成を行うように徹底すれば不変性を維持出来る。

使い方は `test/chapter2/immutable.spec.ts` に載っているので詳しい説明は省略する。

`Ramda.js` は他にも関数型プログラミングを便利にしてくれる機能がたくさんあるので有効だと思う。
