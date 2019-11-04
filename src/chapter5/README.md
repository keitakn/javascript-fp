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

## モナドの種類

モナドには様々な種類が存在する。

ここでは代表的な種類を紹介する。

### 恒等モナド

最も簡単なモナドで値をラップするだけ。

常に同じ型で返ってくるので、各関数のインターフェースを統一出来る。

### Maybeモナド

恒等モナドと似ているが、値を格納するだけでなく、値が存在しない状態を表すことも可能。

`Just` という値をラップする際に利用するデータ型と `Nothing` という空の値を表現するデータ型が存在する。

`Swift` の `Optional` や `Scala` の `Option` はMaybeモナドの実装と言えるだろう。

### Eitherモナド

失敗系と成功系を表現するモナド。

後でこのモナドを利用して第4章で作成した `showTaxIncludedPriceInJpy` を再実装してみる事にしよう。

## JavaScript（TypeScript）でのモナドライブラリ

言語仕様としてモナドは実装されていない為、自分で実装を行うかライブラリの力を借りる必要がある。

筆者のオススメは [fp-ts](https://github.com/gcanti/fp-ts) である。

`Haskell`, `PureScript`, `Scala` 等の関数型パラダイムの言語を参考に開発されているのもあって、その他のライブラリよりも利用されている印象。

### Eitherモナドを利用した `showTaxIncludedPriceInJpy` の再実装

少し長いが下記のようになる。

```typescript
import { pipe } from 'ramda';
import { Either, left, right, toError } from 'fp-ts/lib/Either';

export const Try = <T>(fn: () => T): Either<Error, T> => {
  try {
    const result = fn();

    return right(result);
  } catch (error) {
    return left(toError(error));
  }
};

const validatePrice = (price: Either<Error, number>): Either<Error, number> => {
  return Try<number>(() => {
    if (price._tag === 'Left') {
      throw price.left;
    }

    if (!Number.isInteger(price.right)) {
      throw new Error('price is Not Number!');
    }

    if (price.right < 100) {
      throw new Error('The price should specify more than 100!');
    }

    return price.right;
  });
};

const calculateTaxIncludedPrice = (price: Either<Error, number>): Either<Error, number> => {
  return Try<number>(() => {
    const tax = 1.1;

    if (price._tag === 'Left') {
      throw price.left;
    }

    return price.right * tax;
  });
};

const showPriceInJpy = (price: Either<Error, number>): Either<Error, string> => {
  return Try<string>(() => {
    const formatter = new Intl.NumberFormat('ja-JP');

    if (price._tag === 'Left') {
      throw price.left;
    }

    return `¥${formatter.format(price.right)}`;
  });
};

export const showTaxIncludedPriceInJpy = (price: number): Either<Error, string> => {
  const composed = pipe<
    Either<Error, number>,
    ReturnType<typeof validatePrice>,
    ReturnType<typeof calculateTaxIncludedPrice>,
    ReturnType<typeof showPriceInJpy>
  >(
    validatePrice,
    calculateTaxIncludedPrice,
    showPriceInJpy,
  );

  const eitherPrice = Try<number>(() => {
    return price;
  });

  return composed(eitherPrice);
};
```

まず最初に `Try` という関数を定義する。

この関数は処理の成功時に `right` にその結果を、例外が発生した際に `left` に `Error` を格納して返す。

返り値はEitherモナドとなり以下のようになる。

```
// 処理成功時
{ _tag: 'Right', right: '¥1,100' }

// 例外発生時
{ _tag: 'Left',
  left:
   Error: The price should specify more than 100!
       at exports.Try (/Users/kogakeita/gitrepos/javascript-fp/src/chapter5/Chapter5.ts:33:13)
       at Object.<anonymous>.exports.Try.fn [as Try] (/Users/kogakeita/gitrepos/javascript-fp/src/chapter5/Chapter5.ts:6:20)
       at validatePrice (/Users/kogakeita/gitrepos/javascript-fp/src/chapter5/Chapter5.ts:23:10)
       at /Users/kogakeita/gitrepos/javascript-fp/node_modules/ramda/src/internal/_pipe.js:3:27
       at /Users/kogakeita/gitrepos/javascript-fp/node_modules/ramda/src/internal/_pipe.js:3:27
       at /Users/kogakeita/gitrepos/javascript-fp/node_modules/ramda/src/internal/_arity.js:10:19
       at Object.<anonymous>.exports.showTaxIncludedPriceInJpy.price [as showTaxIncludedPriceInJpy] (/Users/kogakeita/gitrepos/javascript-fp/src/chapter5/Chapter5.ts:80:10)
       at Object.it (/Users/kogakeita/gitrepos/javascript-fp/test/chapter5/monad.spec.ts:18:26)
       at Object.asyncJestTest (/Users/kogakeita/gitrepos/javascript-fp/node_modules/jest-jasmine2/build/jasmineAsyncInstall.js:102:37)
       at resolve (/Users/kogakeita/gitrepos/javascript-fp/node_modules/jest-jasmine2/build/queueRunner.js:43:12)
       at new Promise (<anonymous>)
       at mapper (/Users/kogakeita/gitrepos/javascript-fp/node_modules/jest-jasmine2/build/queueRunner.js:26:19)
       at promise.then (/Users/kogakeita/gitrepos/javascript-fp/node_modules/jest-jasmine2/build/queueRunner.js:73:41)
       at process._tickCallback (internal/process/next_tick.js:68:7) }
```

これらの関数をパイプラインで合成する際には1つ注意点がある。

もし `_tag` の値が `Left` だった場合は例外が発生しているので、下記のように `left` に入っているErrorをThrowする。

```
const calculateTaxIncludedPrice = (price: Either<Error, number>): Either<Error, number> => {
  return Try<number>(() => {
    const tax = 1.1;

    if (price._tag === 'Left') {
      throw price.left;
    }

    return price.right * tax;
  });
};
```

こうする事でどこで関数パイプラインを壊さないでどこで例外が発生しているか、分かるようになる。

非同期処理の場合は `TryAsync` を利用する。

```typescript
import { pipeP } from 'ramda';
import { Either, left, right, toError } from 'fp-ts/lib/Either';
import axios, { AxiosError, AxiosResponse } from 'axios';

export const TryAsync = async <T>(
  fn: () => Promise<T>,
): Promise<Either<Error, T>> => {
  return fn()
    .then(v => right<Error, T>(v))
    .catch(error => left<Error, T>(toError(error)));
};

export const httpClient = axios.create({
  baseURL: 'https://qiita.com',
  timeout: 10000,
});

type QiitaUser = {
  id: string;
};

const fetchQiitaUser = async (qiitaUser: QiitaUser) => {
  return TryAsync<QiitaUser>(() => {
    return httpClient
      .get<QiitaUser>(`/api/v2/users/${qiitaUser.id}`)
      .then((axiosResponse: AxiosResponse) => {
        return Promise.resolve(axiosResponse.data);
      })
      .catch((axiosError: AxiosError) => {
        // このような握りつぶしは良くないが動作確認を単純化する為にこうしておく
        return Promise.reject(new Error(axiosError.message));
      });
  });
};

type QiitaFollowingTag = {
  id: string;
};

const fetchQiitaUserFollowingTags = async (
  qiitaUser: Either<Error, QiitaUser>,
) => {
  return TryAsync<QiitaFollowingTag[]>(async () => {
    if (qiitaUser._tag === 'Left') {
      return Promise.reject(qiitaUser.left);
    }

    return httpClient
      .get<QiitaFollowingTag[]>(
        `/api/v2/users/${qiitaUser.right.id}/following_tags`,
      )
      .then((axiosResponse: AxiosResponse) => {
        const tags = axiosResponse.data.map(
          (qiitaFollowingTag: QiitaFollowingTag) => {
            return { id: qiitaFollowingTag.id };
          },
        );

        return Promise.resolve(tags);
      })
      .catch((axiosError: AxiosError) => {
        return Promise.reject(axiosError);
      });
  });
};

export const fetchFollowingTags = async (
  userId: string,
): Promise<Either<Error, QiitaUser[]>> => {
  /* eslint @typescript-eslint/no-explicit-any: 0 */
  const composed = pipeP<any, any, any>(
    fetchQiitaUser,
    fetchQiitaUserFollowingTags,
  );

  return composed({ id: userId });
};
```

このようにすれば先程と同じように関数合成が可能だ。
