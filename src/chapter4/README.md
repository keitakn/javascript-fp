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

## 関数コンビネータ

関数型言語にはif-elseやfor等の手続き型の制御構文が存在しない。

その為、関数コンビネータという概念を利用する。

JavaScript(TypeScript)は純粋な関数型言語ではないので、if-elseやforを利用する事はもちろん可能。

JavaScript(TypeScript)には関数コンビネータは存在しないので、自分で実装するかライブラリを利用する必要がある。

### identityコンビネータ

与えられた引数と同じ値を返す関数。

TypeScriptで実装するとこんな感じになる。

```typescript
export const identity = <T>(value: T): T => {
  return value;
};

// 利用する場合
type User = {
  email: string;
  name: string;
};

const testUser: User = {
  email: 'test@gmail.com',
  name: 'TestUser'
};

console.log(identity<User>(testUser));
// { email: 'test@gmail.com', name: 'TestUser' }
```

関数の数学的な性質を調べるために広く使用されているが、実用的な用途として以下のような物がある。

- 引数となる関数を評価する際に、引数を期待する高階関数にデータを与える。これは以前、ポイントフリーコードを記述する際に行ったとおりに実施する
- 関数コンビネータのフローに対してユニットテストを行う。これはアサーションを行うために簡単な関数の結果が必要な場合である。たとえば、恒等関数を使用するcompose関数に関してユニットテストを記述することができる。
- カプセル化した型からデータを関数的に抽出する。

[こちら](https://codeday.me/jp/qa/20190503/767039.html) のブログが参考になる。

### tap（Kコンビネータ）

void型関数を合成に対して橋渡しするのに便利。

`Ramda` の `R.tap` を利用すると良いだろう。

```typescript
const debugLog = _.partial(logger, 'console', 'basic', 'MyLogger', 'DEBUG');
const debug = R.tap(debugLog);
const cleanInput = R.compose(normalize,debug,trim);
const isValidSsn = R.compose(debug,checkLengthSsn,debug,cleanInput);
```

debugを（R.tapに基づいて）呼び出しても、プログラムの結果は一切変わらない。

### alternation（ORコンビネータ）

関数呼び出しに応えて既存の振る舞いを提供する際に、簡単な条件付きロジックを実行する関数。

```typescript
const alt = function(func1, func2) {
  return function (val) {
    return func1(val) || func2(val);
  }
}
```

`Ramda` を使えば以下のように実装出来る。

```typescript
const alt = R.curry((func1, func2, val) => func1(val) || func2(val));
```

取得処理が失敗したときに、新しいオブジェクトを作成するような実装が可能になる。

### sequence（Sコンビネータ）

一連の複数の関数をループするために使用される関数。

値を返さない。合成に追加したい場合は、 `R.tap` を利用する。

### fork(join)コンビネータ

1個のリソースを2通りの異なる方法で処理して、その結果を結合するのに利用される。

