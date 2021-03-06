# 第1章 関数型で思考する

関数型で思考する為に必要不可欠な用語を記載する。

## 宣言型プログラミング

関数型プログラミングは宣言型プログラミング。

処理がどのように実装されているか、またデータがどのように流れるかを明示することなく、一連の処理を表現するパラダイム。

これに対してJavaやC等で使われているのは手続き型。

以下に手続き型と宣言型の違いを記載しておく。

### 手続き型

おそらく多くのプログラマに馴染みのある書き方。

ループ制御を行い配列内の数値を2乗する。

```typescript
const array = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
for (let i = 0; i < array.length; i++) {
  array[i] = Math.pow(array[i], 2);
}

console.log(array);
// [ 0, 1, 4, 9, 16, 25, 36, 49, 64, 81 ]
```

### 宣言型

同じコードを宣言型で書くとこうなる。

```typescript
const result = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num: number) => {
  return Math.pow(num, 2);
});

console.log(result);
// [ 0, 1, 4, 9, 16, 25, 36, 49, 64, 81 ]
```

手続き型と比較するとループ用のカウンタと配列のindexを管理する責務が消えており、より簡潔な書き方になっている。

少し話が逸れるが、バックエンドで良く使うSQLも宣言型のプログラミングと言える。

SQLはクエリの結果をどのように出力するか記述するものだが、取得ロジックは内部に隠蔽されている。

## 純粋関数

関数型プログラミングで宣言する関数は純粋関数である必要がある。

純粋関数の定義は以下の通り。

- 提供される入力値のみに依存する事
- 関数の実行中に状態が変更される可能性がある隠された値や外部スコープの値には一切依存しない事
- 関数自身のスコープ外にある値を一切変更しない事（グローバル変数や参照渡しされた引数を変更しない事）

これらの要件を満たさない関数は「不純」となる。

スコープ外の値が意図せずに変更されてしまう事を「副作用」と呼ぶ。

副作用には他にも以下のような物がある。

- グローバルに存在する変数やプロパティ、データ構造を変更する
- 関数の引数の元の値を変更する
- ユーザー入力を処理する
- 同じ関数内で補足出来なかった場合は、例外を投げる
- 画面表示やログ出力
- HTMLドキュメント、Cookie、データベースへの問い合わせ

例えば以下の関数は不純であり、副作用が存在する。

自身のスコープ外である `counter` を変更しようとしているからである。

```typescript
let counter = 0;
const increment = () => {
  return ++counter;
};
```

他にもJavaScriptで標準で組み込まれている `Date.now()` も副作用を持つ関数。

常に変化する「時刻」という要因に結果が左右されてしまうからである。

先程例に上げた `increment` を純粋な関数にする為には下記のような構造にする必要がある。

```typescript
const increment = (counter: number) => {
  return counter + 1;
};
```

### 不純関数と副作用を完全になくす事は不可能

データベースに値を保存出来なかったり、Cookieに値を入れずにシステムを構築する事は不可能である事を考えれば分かると思う。

そうではなく、不純関数と純粋関数を分離し、状態を管理しつつ変更を最小限に抑える為の方法を模索するのが現実的な関数型プログラミングである。

## 参照透過性と代替性

参照透過性とは関数が純粋である事を特徴づける性質。

ある関数が同じ入力に対して常に同じ結果を返す場合、その関数は「参照透過」であると言える。

最初に例に上げた↓下記の関数は参照透過性を持っていない。

外部変数である `counter` の値によって結果が変わってしまうからである。

```typescript
let counter = 0;
const increment = () => {
  return ++counter;
};
```

下記のようにすると引数のみに依存する形となり、同じ数値を渡せば常に同じ結果が返ってくるので参照透過性を持っていると言える。

```typescript
const increment = (counter: number) => {
  return counter + 1;
};
```

関数型の設計では定義する関数は常に参照透過性を持たせるべきである。

参照透過性がある関数は書き換えや代替が簡単に出来る。

イメージとしては下記のような形。

Program = [Input] + [func1, func2, func3, ...] -> Output

`src/chapter1/Chapter1.ts` 内に定義されている関数を例に説明する。

全て参照透過性を持つと仮定すると、例えば `average` を以下のように書き換えても成り立つ。

```typescript
const average = divide(270, 3);
```

`test/chapter1/average.spec.ts` に対応するテストコードがあるので試しに書き換えてもテストが通る事が分かると思う。

このように全ての関数が参照透過性を持つように設計すると、プログラムはシステム的、数学的な方法で把握出来るようになる。

## データの不変性を維持する

関数型プログラミングでは一度生成したデータは変更出来ないようにする事がベストである。

これはオブジェクト指向におけるimmutableオブジェクトと同様の感覚で現代では一般的になった考え方だと言えるだろう。

ただ残念な事にJavaScriptの標準言語仕様だけでこれを徹底するのは難しい。

```typescript
const sortDesc = (array: number[]) => {
  return array.sort((a: number, b: number) => {
    return b - a;
  });
};
```

例えばこの関数、これは配列をソートする単純な関数だが、一見副作用がなさそうなこれも実は元の配列自身のindexを更新してしまう。

```typescript
const array = [1, 2, 3, 4, 5, 6, 7, 8, 9];
console.log(sortDesc(array)); // [ 9, 8, 7, 6, 5, 4, 3, 2, 1 ]
console.log(array); // [ 9, 8, 7, 6, 5, 4, 3, 2, 1 ]
```

ECMAScript 2015から定義された `const` で変数の上書きは出来なくなったが、配列の操作等は可能である。

これは言語仕様上どうしようもない。

実戦では [Ramda](https://ramdajs.com/) や [immutable](https://facebook.github.io/immutable-js/) 等の外部ライブラリを使ってカバーする必要があるだろう。

## 複雑なタスクはシンプルな関数に分割する

参照透過性を持った純粋関数を定義するには必要不可欠な考え方である。

関数が巨大だと知らないうちに副作用を作ってしまったり、デバッグが大変になるのでNG。

シンプルな関数を作る上では「単一責任の原則」を守る事が大事。
