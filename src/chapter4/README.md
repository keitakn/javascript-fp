# 第4章 モジュール化によるコードの再利用

モジュール性はプログラムをより小さい独立したものに分離出来る程度を表している。

モジュール化されたプログラムは構成要素の意味からプログラム全体の意味が分かる。

本章のサンプルコードは `Ramda` を使って実装する。

## メソッドチェーンと関数パイプライン

第3章でメソッドチェーンについて触れたが、関数型の世界には関数パイプラインと呼ばれる仕組みが存在する。

例えば `isEmpty` のような真偽値を返す関数は下記のように表す事が出来る。

`[関数名] :: [0個以上の入力型] -> [アウトプット]`

`isEmpty :: String -> Boolean`

メソッドチェーンはあくまでもメソッドをつなげているだけなので、限られた表現しか出来ない。

しかし関数パイプラインはメソッドチェーンよりも緩い結合なのでより柔軟性がある。

このコードは `ramda.pipe` を利用した関数パイプラインのサンプルコードである。

```typescript jsx
import * as R from 'ramda';

const validatePrice = (price: number): number => {
  if (!Number.isInteger(price)) {
    return 0;
  }

  if (price < 100) {
    return 0;
  }

  return price;
};

const calculateTaxIncludedPrice = (price: number): number => {
  const tax = 1.1;

  return price * tax;
};

const showPriceInJpy = (price: number): string => {
  const formatter = new Intl.NumberFormat('ja-JP');

  return `¥${formatter.format(price)}`;
};

export const showTaxIncludedPriceInJpy = (price: number): string => {
  const composed = R.pipe<
    number,
    ReturnType<typeof validatePrice>,
    ReturnType<typeof calculateTaxIncludedPrice>,
    ReturnType<typeof showPriceInJpy>
  >(
    validatePrice,
    calculateTaxIncludedPrice,
    showPriceInJpy,
  );

  return composed(price);
};
```

`showTaxIncludedPriceInJpy(1000)` とすると出力結果は `¥1,100` となる。

引数で渡した `1000` が validatePrice -> calculateTaxIncludedPrice -> showPriceInJpyの順に適応されている事が分かる。

しかしこのコードにはまだ問題点がある。

validatePriceの実装が不自然になっている。

Boolean型が返りそうなのに数値で返している。

かと言って、 `true`, `false` を返すと関数パイプラインが崩れてしまう。

このようなケースでどのように対処するかは次回以降の章で説明する。

## タプル(tuple)

関数型言語はタプルと呼ばれる構造に対応している。

タプルは、有限かつ順番に並べられたリスト要素であり、通常は一度に2〜3個の値をまとめたもので、(a,b,c)などど記述される。

タプルを使わない場合、一時的なデータをオブジェクトや配列として返すのが良く使われるかと思う。

↓こんな感じだ。

```typescript
return {
  status: false,
  message: "Input is not long!"
};

// もしくは
return [false, "Input is not long!"];
```

関数間でデータを転送する必要がある場合、次の理由からタプルのほうが有利。

- タプルは不変性。一度作成されると、タプルの内部データは変更不可
- 一時的な型はモデルが必要以上に複雑になる

ただし残念ながらJavaScriptには言語レベルでタプル型を宣言する事は出来ない。

TypeScriptにはタプル型が存在するがあくまでも配列なので、注意して利用する必要がある。

（参考）[TypeScriptの型入門 タプル型](https://qiita.com/uhyo/items/e2fdef2d3236b9bfe74a#%E3%82%BF%E3%83%97%E3%83%AB%E5%9E%8B)

## カリー化

カリー化を理解する為には通常のカリー化されていない関数の挙動を理解する必要がある。

JavaScriptでは引数が足りない場合でも関数を呼び出せる。

これは内部的に足りない引数が `undefined` で補われているからである。

`Ramda` を使って説明する。

例えば以下のような関数があったとする。

これは引数が文字列型かどうかを調べる単純な関数である。

```typescript
import * as R from "ramda";

const isString = (test: any) => {
  return R.is(String, test);
};
```

この関数には引数が必要である。

しかし引数なしで実行しても `false` が返却される。

足りない引数を `undefined` で補っているからである。

この場合はちゃんとbooleanで返ってくるのでそんなに困らないかもしれない。

しかし下記のような場合はどうだろう？

```typescript
const plus = (a: number, b: number) => {
  return a + b;
};
```

引数を2つ足すだけの単純な関数だ。

`plus(1)` のように呼び出すと結果は `NaN` となる。

この例は単純なのですぐに原因に気がつけるかもしれない、しかしもう少し複雑な関数だとデバッグに余計な時間が取られてしまうだろう。

では先程の `plus` をカリー化してみる。

```typescript
import * as R from "ramda";

const plus = R.curry((a: number, b: number) => {
  return a + b;
});
```

先程と同じように `plus(1)` で呼び出してみると、`Function` オブジェクトが返ってくる事が分かる。

カリー化された関数はこのように引数が足りない場合、関数の実行を保留し足りない分の引数を受け取る新しい関数を返す。

この性質を利用すると以下のような事が出来る。

```typescript
import * as R from "ramda";

const plus = R.curry((a: number, b: number) => {
  return a + b;
});

const plus10 = plus(10);

// 結果は 11
console.log(plus10(1));
```

このように汎用的な `plus` 関数を拡張してより特化した `plus10` 関数を簡単に作り出せる。

このテクニックを利用するとオブジェクト指向でやっているファクトリパターンのような実装（`test/chapter4/findStudent.spec.ts` を参照）が可能になる。

また `test/chapter4/logger.spec.ts` でやっているような再利用可能な関数テンプレートを作成出来る。

このようにカリー化は関数型で設計する際に非常に重要なテクニックと言えるだろう。

- （参考）[JavaScript ( 時々 TypeScript ) で学ぶ関数型プログラミングの基礎の基礎 #2 - カリー化について](https://tech.recruit-mp.co.jp/front-end/post-15885/)
- （参考）[【JavaScript】部分適用とカリー化](https://qiita.com/To_BB/items/f2f73a218da322194f46)

JavaScript(TypeScript)にはカリー化の機能は備わっていない。

自分でカリー化する為の仕組みを構築する事も可能だが複雑になるので `Ramda` のような関数型プログラミングを後押しするライブラリを使うのが良いだろう。 
