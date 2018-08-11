import * as R from "ramda";
import { getLogger, configure } from "log4js";
import { Students } from "../domain/types/Students";
import { Student } from "../domain/types/Student";

/**
 * 第4章 モジュール化によるコードの再利用
 */
export namespace Chapter4 {
  /**
   * 実際は単に決められた値を返しているだけだがDBから取得していると仮定
   */
  export class DatabaseStore {
    private readonly students: Students;

    constructor() {
      const student = {
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

      this.students = [student];
    }

    /**
     * 学生を取得する
     *
     * @param {string} ssn
     * @return {Student}
     */
    find(ssn: string): Student {
      if (ssn === "111-11-1111") {
        return this.students[0];
      }

      throw new Error("NotFound");
    }
  }

  /**
   * 配列から学生を検索する
   */
  export class ArrayStore {
    private readonly students: Students;

    constructor() {
      const student = {
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

      this.students = [student];
    }

    /**
     * 学生を取得する
     *
     * @param {string} ssn
     * @return {Student}
     */
    find(ssn: string): Student {
      if (ssn === "111-11-1111") {
        return this.students[0];
      }

      throw new Error("NotFound");
    }
  }

  /**
   * DBオブジェクトから学生を取得する
   *
   * @type {R.CurriedFunction2<Chapter4.DatabaseStore, string, Student>}
   */
  export const fetchStudentFromDb = R.curry(
    (store: DatabaseStore, ssn: string) => {
      return store.find(ssn);
    }
  );

  /**
   * 配列から学生を検索する
   *
   * @type {R.CurriedFunction2<Chapter4.ArrayStore, string, Student>}
   */
  export const fetchStudentFromArray = R.curry(
    (store: ArrayStore, ssn: string) => {
      return store.find(ssn);
    }
  );

  /**
   * @param {string} level
   * @param message
   */
  export const logger = (level: string, message: any) => {
    configure({
      appenders: {
        out: {
          type: "stdout",
          layout: {
            type: "coloured"
          }
        }
      },
      categories: {
        default: {
          level,
          appenders: ["out"]
        }
      }
    });

    const logger = getLogger("javascript-fp");

    logger.log(level, message);
  };
}
