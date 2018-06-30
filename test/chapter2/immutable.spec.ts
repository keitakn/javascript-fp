import { assoc, lens, path, set, assocPath, view } from "ramda";
import { IAddress } from "../../src/domain/IAddress";
import { IPerson } from "../../src/domain/IPerson";

/**
 * 第2章 関数型言語としてのJavaScript 不変オブジェクトを作るテスト
 */
describe("Chapter2.immutable", () => {
  /**
   * 不変オブジェクトを作成出来る事を確認する
   */
  it("should be able to create immutable objects using by assoc", () => {
    const originalAddress = {
      country: "JP",
      postalCode: "1000014",
      region: "東京都",
      locality: "千代田区",
      streetAddress: "永田町１丁目７−１"
    };

    const originalPerson = {
      ssn: "999-99-9999",
      givenName: "keita",
      familyName: "kn",
      birthdate: "1999-01-01",
      address: originalAddress
    };

    const newAddress = assoc<string, IAddress, string>(
      "streetAddress",
      "1-7-1",
      originalAddress
    );

    const newPerson = assoc<IAddress, IPerson, string>(
      "address",
      newAddress,
      originalPerson
    );

    const expectedPerson = {
      ssn: "999-99-9999",
      givenName: "keita",
      familyName: "kn",
      birthdate: "1999-01-01",
      address: {
        country: "JP",
        postalCode: "1000014",
        region: "東京都",
        locality: "千代田区",
        streetAddress: "1-7-1"
      }
    };

    expect(newPerson).toEqual(expectedPerson);
  });

  /**
   * レンズを使って不変オブジェクトを作成出来る事を確認する
   */
  it("should be able to create immutable objects using by lens", () => {
    const originalAddress = {
      country: "JP",
      postalCode: "1000014",
      region: "東京都",
      locality: "千代田区",
      streetAddress: "永田町１丁目７−１"
    };

    const originalPerson = {
      ssn: "999-99-9999",
      givenName: "keita",
      familyName: "kn",
      birthdate: "1999-01-01",
      address: originalAddress
    };

    const personPath = ["address"];
    const personLens = lens(path(personPath), assocPath(personPath));

    const newAddress = {
      country: "JP",
      postalCode: "1600014",
      region: "東京都",
      locality: "新宿区",
      streetAddress: "内藤町１１"
    };

    const newPerson = set(personLens, newAddress, originalPerson);
    const expectedPerson = {
      ssn: "999-99-9999",
      givenName: "keita",
      familyName: "kn",
      birthdate: "1999-01-01",
      address: {
        country: "JP",
        postalCode: "1600014",
        region: "東京都",
        locality: "新宿区",
        streetAddress: "内藤町１１"
      }
    };

    expect(newPerson).toEqual(expectedPerson);
    expect(view(personLens, newPerson)).toEqual(newAddress);
    expect(view(personLens, originalPerson)).toEqual(originalAddress);
  });
});
