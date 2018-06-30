import { Chapter2 } from "src/chapter2/Chapter2";

/**
 * 第2章 関数型言語としてのJavaScript 郵送先住所（formatted）を生成するテスト
 */
describe("Chapter2.generateFormattedAddress", () => {
  /**
   * 郵送用にフォーマットされた住所が生成出来る事を確認する
   */
  it("should be able to generate a formatted address", () => {
    const originalAddress = {
      country: "JP",
      postalCode: "1000014",
      region: "東京都",
      locality: "千代田区",
      streetAddress: "永田町１丁目７−１"
    };

    expect(Chapter2.generateFormattedAddress(originalAddress)).toBe(
      "JP 〒1000014 東京都千代田区永田町１丁目７−１"
    );
  });
});
