import { Chapter1 } from "src/chapter1/Chapter1";

/**
 * 第1章 関数型で思考する の平均値をもとめる関数のテストコード
 */
describe("Chapter1.average", () => {
  /**
   * 平均値が算出出来る事をテストする
   */
  it("should be able to calculate the average value", () => {
    const numbers = [80, 90, 100];

    expect(Chapter1.average(numbers)).toBe(90);
  });
});
