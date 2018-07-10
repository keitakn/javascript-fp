import { People } from "../domain/types/People";
import { Person } from "../domain/types/Person";

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
}
