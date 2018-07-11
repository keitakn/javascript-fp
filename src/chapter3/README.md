# 第3章 データ構造の数を減らし、操作の数を増やす

## アプリケーションの制御フロー

手続き型では主にループや条件分岐でロジックを制御する。

一方関数型では単純な関数を実行していく事で抽象度を上げていく。

コードで書くとこんな感じ。

```typescript
return _.chain(people)
  .filter((person: Person) => isJapanesePeople(person))
  .sortBy(people, ["givenName"])
  .map((person: Person) => selectNameColumn(person))
  .value();
```

`_.chain` は [Lodash](https://lodash.com/docs/4.17.10) というライブラリが持つ機能でこれを使うと関数を繋げて実行出来るようになる。

これを関数チェーンと呼ぶ。

jQuery等を使った事がある人ならメソッドチェーンという言葉を聞いた事があるだろうし、実際に利用していたりもするだろう。

ざっくりと言うと、それの関数版だと理解すると良い。

## 関数型で設計する上で重要なメソッド

JavaScriptで関数型の設計を行う上で外せない存在がある。

配列操作を行う `map` , `reduce` , `filter` である。

この3つはドキュメントを読んで利用方法をよく理解しておく必要がある。

### [map](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/map)

与えられた関数を配列のすべての要素に対して呼び出し、その結果からなる新しい配列を生成する。

これを利用する事で多くのループ文は消す事が出来る。

### [reduce](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce)

アキュムレータと配列の各要素に対して（左から右へ）関数を適用し、単一の値にする。

例えば「配列の中身を足して合計を求める」みたいな事が出来る。

```typescript
const array = [1, 2, 3];

const result = array.reduce((previous, current, index, array) => {
  return previous + current;
});

console.log(result); // 6
```

### [filter](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)

引数として与えられたテスト関数を各配列要素に対して実行し、それに合格したすべての配列要素からなる新しい配列を生成する。

これも配列から新しい配列を生成する便利なメソッド。

## SQLライクな関数

第1章のところで関数型プログラミングは宣言型のプログラミングで、宣言型の手法にはSQLが挙げられるという説明をした。

`map` 等のメソッドを利用すれば下記のようにSQLチックな関数を実装出来る。

```typescript
import * as _ from "lodash";
import { People } from "../domain/types/People";
import { Person } from "../domain/types/Person";

/**
 * 日本人かどうかを判定する
 * SQLで言うところのWHERE
 * この関数相当の物を入れ替える事によって sqlLikeSearch() は汎用的な関数になる
 *
 * @param {Person} person
 * @returns {boolean}
 */
const isJapanesePeople = (person: Person) => {
  return person.address.country === "JP";
};

/**
 * Personから必要なColumnを選択する
 * SQLで言うところのSELECT
 * この関数相当の物を入れ替える事によって sqlLikeSearch() は汎用的な関数になる
 *
 * @param {Person} person
 * @returns {NameColumn}
 */
const selectNameColumn = (person: Person): NameColumn => {
  return {
    givenName: person.givenName,
    familyName: person.familyName
  };
};

/**
 * 名でソートする
 *
 * @returns {string[]}
 */
const sortAtGivenName = () => {
  return ["givenName"];
};

/**
 * SQLライクな検索関数
 *
 * map() = SELECT
 * filter() = WHERE
 * sortBy() = ORDER BY
 *
 * これらに渡す関数は自由に入れ替える事が出来るので汎用的であると言える
 *
 * @param {People} people
 * @returns {NameColumn[]}
 */
export const sqlLikeSearch = (people: People): NameColumn[] => {
  return _.chain(people)
    .filter((person: Person) => isJapanesePeople(person))
    .sortBy(people, sortAtGivenName())
    .map((person: Person) => selectNameColumn(person))
    .value();
};
```

`filter()` , `sortBy()` , `map()` に渡す関数の中身を入れ替えれば、まるでSQLのように自在な条件で `People` オブジェクトを検索出来る。
