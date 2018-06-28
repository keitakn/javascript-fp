import { Chapter1 } from "../../src/chapter1/Chapter1";

/**
 * 第1章 関数型で思考する 2つの授業を受けており成績が100点の学生を検索する関数のテスト
 */
describe("Chapter1.search", () => {
  /**
   * 2つの授業を受けており成績が100点の学生を検索出来る事をテスト
   */
  it("should be able to search for students with two grades and 100 grades", () => {
    const enrollments = [
      {
        // student enrolled in 3 courses, with avg grade of 90
        enrolled: 3,
        grade: 90
      },
      {
        // student enrolled in 1 course, with avg grade of 100
        enrolled: 1,
        grade: 100
      },
      {
        // student enrolled in 1 course, with avg grade of 87
        enrolled: 1,
        grade: 87
      }
    ];

    expect(Chapter1.search(enrollments)).toBe(90);
  });
});
