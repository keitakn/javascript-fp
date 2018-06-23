import { Sample } from "../../src/sample/Sample";

/**
 * Sample Test
 */
describe("Sample.showMessage", () => {
  /**
   * 意図したメッセージを返す事をテスト
   */
  it("should be able to return a message", () => {
    expect(Sample.showMessage("Hello World!")).toBe("Hello World!");
  });
});
