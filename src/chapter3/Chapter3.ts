import * as _ from "lodash";
import { People } from "../domain/types/People";
import { Person } from "../domain/types/Person";

/**
 * sqlLikeSearch Response IF
 */
interface NameColumn {
  givenName: string;
  familyName: string;
}

/**
 * 第3章 データ構造の数を減らし、操作の数を増やす
 */
export namespace Chapter3 {
  /**
   * 国別の集計結果を返す
   *
   * @param {People} people
   * @returns {{[p: string]: number}}
   */
  export const subtotalByCountry = (people: People) => {
    return people.reduce((stat: { [name: string]: number }, person: Person) => {
      const country = person.address.country;

      stat[country] = stat[country] === undefined ? 1 : stat[country] + 1;

      return stat;
    }, {});
  };

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
      .sortBy(people, ["givenName"])
      .map((person: Person) => selectNameColumn(person))
      .value();
  };
}
