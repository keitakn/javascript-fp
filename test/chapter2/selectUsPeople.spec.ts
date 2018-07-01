import { Chapter2 } from "src/chapter2/Chapter2";

/**
 * 第2章 関数型言語としてのJavaScript 国がUSの人々を選択する関数のテスト
 */
describe("Chapter2.selectUsPeople", () => {
  /**
   * 国がUSの人々を選択する事が出来る事を確認する
   */
  it("should be able to select the country People US", () => {
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

    expect(Chapter2.selectUsPeople(people)).toEqual([usPerson]);
  });

  /**
   * 空の配列が戻ってくる事を確認する
   */
  it("should be an empty array returned", () => {
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

    const people = [japanPerson];

    expect(Chapter2.selectUsPeople(people)).toEqual([]);
  });
});
