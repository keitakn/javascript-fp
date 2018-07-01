import { Person } from "./Person";

/**
 * 学生を表すオブジェクトIF
 */
export interface Student extends Person {
  /**
   * 学校
   */
  school: string;
}
