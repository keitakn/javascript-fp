import { Chapter3 } from "../../src/chapter3/Chapter3";

/**
 * 第3章 データ構造の数を減らし、操作の数を増やす SQLライクな検索関数
 */
describe("Chapter3.sqlLikeSearch", () => {
  /**
   * 実装したsqlLikeSearchで日本人オブジェクトが名前だけ取得出来るハズ
   */
  it("should be possible for Japanese objects to be named only", () => {
    const japanAddress = {
      country: "JP",
      postalCode: "1000014",
      region: "東京都",
      locality: "千代田区",
      streetAddress: "永田町１丁目７−１"
    };

    const firstJapanPerson = {
      ssn: "999-99-9999",
      givenName: "keita",
      familyName: "kn",
      birthdate: "1999-01-01",
      address: japanAddress
    };

    const secondJapanPerson = {
      ssn: "888-88-8888",
      givenName: "Moko",
      familyName: "Moko",
      birthdate: "1999-01-01",
      address: japanAddress
    };

    const usAddress = {
      country: "US",
      postalCode: "926660",
      region: "CA",
      locality: "Irvine",
      streetAddress: "123 A St. Apt#1"
    };

    const usPerson = {
      ssn: "111-11-1111",
      givenName: "keita",
      familyName: "kn",
      birthdate: "2000-01-01",
      address: usAddress
    };

    const people = [secondJapanPerson, firstJapanPerson, usPerson];

    const expectedPeople = [
      { givenName: "keita", familyName: "kn" },
      { givenName: "Moko", familyName: "Moko" }
    ];

    expect(Chapter3.sqlLikeSearch(people)).toEqual(expectedPeople);
  });
});
