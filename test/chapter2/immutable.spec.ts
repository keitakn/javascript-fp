import { assoc } from "ramda";
import { IAddress } from "../../src/domain/IAddress";
import { IPerson } from "../../src/domain/IPerson";

/**
 * 第2章 関数型言語としてのJavaScript 不変オブジェクトを作るテスト
 */
describe("Chapter2.immutable", () => {
  /**
   * 不変オブジェクトを作成出来る事を確認する
   */
  it("should be able to create immutable objects", () => {
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
});
