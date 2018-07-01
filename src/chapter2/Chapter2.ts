import { Address } from "../domain/types/Address";
import { People } from "../domain/types/People";
import { Person } from "../domain/types/Person";

/**
 * 第2章 関数型言語としてのJavaScript
 */
export namespace Chapter2 {
  /**
   * 郵送先住所（formatted）を生成する
   *
   * e.g. "JP 〒1000014 東京都東京都千代田区永田町１丁目７−１
   *
   * @param {Address} address
   * @returns {string}
   */
  export const generateFormattedAddress = (address: Address) => {
    return `${address.country} 〒${address.postalCode} ${address.region}${
      address.locality
    }${address.streetAddress}`;
  };

  /**
   * Personオブジェクトから条件に合うオブジェクトを選択する
   *
   * @param {People} people
   * @param {Function} selector
   */
  const selectPeople = (people: People, selector: Function) => {
    return people
      .map((person: Person) => {
        if (selector(person)) {
          return person;
        }

        // TODO 型定義が厳密に出来ていないので何とかしたいモナドを使えば解決しそうだが
        return {};
      })
      .filter((person: any) => {
        return Object.keys(person).length > 0;
      });
  };

  /**
   * @param {Person} person
   * @returns {boolean}
   */
  const inUsPeople = (person: Person) => {
    return person.address.country === "US";
  };

  /**
   * 国がUSの人々を選択する
   *
   * @param {People} people
   * @returns {(Person | {})[]}
   */
  export const selectUsPeople = (people: People) => {
    return selectPeople(people, inUsPeople);
  };
}
