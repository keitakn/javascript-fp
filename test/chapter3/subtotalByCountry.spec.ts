import { Chapter3 } from "../../src/chapter3/Chapter3";

/**
 * 第3章 データ構造の数を減らし、操作の数を増やす 国コードの集計関数
 */
describe("Chapter3.subtotalByCountry", () => {
  /**
   * 国コードを集計したオブジェクトが返ってくる事を期待
   */
  it("should return an object that summarized the country code", () => {
    const japanAddress = {
      country: "JP",
      postalCode: "1000014",
      region: "東京都",
      locality: "千代田区",
      streetAddress: "永田町１丁目７−１"
    };

    const japanPerson = {
      ssn: "999-99-9999",
      givenName: "keita",
      familyName: "kn",
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

    const people = [japanPerson, japanPerson, usPerson];

    expect(Chapter3.subtotalByCountry(people)).toEqual({ JP: 2, US: 1 });
  });
});
