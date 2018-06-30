import { IPerson } from "./IPerson";

/**
 * 学生を表すオブジェクトIF
 */
export interface IStudent extends IPerson {
  /**
   * 学校
   */
  school: string;
}
