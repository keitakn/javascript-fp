import { Chapter4 } from "src/chapter4/Chapter4";

/**
 * 第4章 モジュール化によるコードの再利用のテスト
 */
describe("Chapter4.findStudent", () => {
  /**
   * DBオブジェクトから学生が取得出来ること
   */
  it("should be able to find student from db", () => {
    const database = new Chapter4.DatabaseStore();

    // Databaseから学生を検索する関数を作成
    // ※ まあ実際ただ配列から取っているだけだけどデータベースから取っていると仮定して
    const findStudent = Chapter4.fetchStudentFromDb(database);

    const expectedStudent = {
      ssn: "111-11-1111",
      givenName: "keita",
      familyName: "kn",
      birthdate: "2000-01-01",
      address: {
        country: "US",
        postalCode: "926660",
        region: "CA",
        locality: "Irvine",
        streetAddress: "123 A St. Apt#1"
      },
      school: "Fラン"
    };

    expect(findStudent("111-11-1111")).toEqual(expectedStudent);
  });

  /**
   * 配列から学生オブジェクトを取得出来ること
   */
  it("should be able to find student from array", () => {
    const arrayStore = new Chapter4.ArrayStore();

    const findStudent = Chapter4.fetchStudentFromArray(arrayStore);

    const expectedStudent = {
      ssn: "111-11-1111",
      givenName: "keita",
      familyName: "kn",
      birthdate: "2000-01-01",
      address: {
        country: "US",
        postalCode: "926660",
        region: "CA",
        locality: "Irvine",
        streetAddress: "123 A St. Apt#1"
      },
      school: "Fラン"
    };

    expect(findStudent("111-11-1111")).toEqual(expectedStudent);
  });
});
