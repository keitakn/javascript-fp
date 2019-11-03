# 第5章 複雑性を抑えるデザインパターン

## 関数型プログラミングにおける例外処理の問題

第4章で関数パイプラインについてのサンプルコードを作成した。

```typescript
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

このコードには大きな問題がある。

`validatePrice` に不正な値が入ってきた場合でも `0` で処理されてしまう。

値が不正だった時に `0` で処理されるというのは分かりにくい。

JavaScriptには `try catch` の仕組みが存在し例外をThrowする事が出来る。

しかし関数型プログラミングでは例外をThrowすると色々と問題が起こる為、コードを複雑化させる原因になる。

例えば以下のような問題点だ。

- 合成やチェーン化が困難になる
- 参照透過性の原則に違反する
- 関数パイプラインが崩れてしまう

現実のプログラミングではWebAPIに接続したり、DBに接続したりするので、いつ例外が発生するか分からない。

どうにかしてこの問題を解決する必要がある。

## モナド

このような場合、ファンクターの概念を利用する。

ファンクターの概念を利用する事をによりモナドというデータ型を利用する。

モナドは関数型プログラミングの概念で最も難しいものである。

[30分でわかるJavaScriptプログラマのためのモナド入門](https://kentutorialbook.github.io/30minLearningJavaScriptMonad/) という記事を参照し説明する。

モナドは以下の3つの要素が含まれている必要がある。

1. 型コンストラクタ

```
基本的な型に対してモナドの動作を追加した型を作成する機能。
例えば、基本的なデータ型numberに対して、Maybe<number>という型を定義する。
```

2. unit関数

```
これは一定の値をラップして、基本的な型をモナドに変えるもの。
例えばMaybeモナドで、number型に対して値2をラップした場合、Maybe<number>型のMaybe(2)という値になる。
```

3. bind関数

```
これは、モナド値の操作を連鎖させる。
```

これらの特性を備えている為、以下のような事が実現出来る。

- 成功時にも失敗時にも常に同じインターフェースで利用出来る
- 関数合成が可能になる（例外が起こっても関数パイプラインを破壊しない）

## モナドに近いがモナドではない物

### jQuery

JavaScriptの世界には正確にはモナドではないが、その性質を持っている物がいくつか存在する。

例えば [jQuery](https://jquery.com/) というライブラリがそうだ。

かつては世界中の様々なWebサイトで使われていたjQueryだが、このライブラリの特徴は `$()` 関数にある。

この関数は常にjQueryオブジェクトを返す。

```typescript
$("#p1")
  .css("color", "red")
  .slideUp(2000)
  .slideDown(2000);
```

このようにメソッドチェーンを書き続ける事で様々なDOM操作が可能になる。

jQueryの一部の特性としてモナドの性質を備えている理由はこのメソッドチェーンが壊れる事がないから。

### Promise

モダンJavaScriptでは既に一般的な存在になった `Promise` 非同期処理が中心となるJavaScriptでは `Promise` に対する理解が必須になっている。

`Promise` は成功時でも失敗時でも常に `Promise` オブジェクトを返す。

モナドだと言う人もいるが（筆者もそう思っていた時期があった）モナドの要件を全て満たしてはいない。

ちなみに `Promise` ベースの [Fluture](https://www.npmjs.com/package/fluture) というライブラリはモナドインターフェイスになっている模様。



