import * as _ from 'lodash';

// 第1章 関数型で思考する

/**
 * use Chapter1.search
 */
interface Student {
  enrolled: number;
  grade: number;
}

/**
 * 加算する
 *
 * @param {number} total
 * @param {number} current
 * @returns {number}
 */
const sum = (total: number, current: number): number => {
  return total + current;
};

/**
 * 配列の内の数値を合計する
 *
 * @param {number[]} numbers
 * @returns {number}
 */
const total = (numbers: number[]): number => {
  return numbers.reduce(sum);
};

/**
 * 配列の大きさをもとめる
 *
 * @param {number[]} numbers
 * @returns {number}
 */
const size = (numbers: number[]): number => {
  return numbers.length;
};

/**
 * 除算
 *
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
const divide = (a: number, b: number): number => {
  return a / b;
};

/**
 * 平均値を求める
 *
 * @param {number[]} numbers
 * @returns {number}
 */
export const average = (numbers: number[]): number => {
  return divide(total(numbers), size(numbers));
};

/**
 * 検索する
 * 2つの授業を受けており成績が100点の学生を検索
 * サンプルなので検索条件は固定
 *
 * @param {Student[]} enrollments
 * @returns {number}
 */
export const search = (enrollments: Student[]) => {
  return _.chain(enrollments)
    .filter((student: Student) => student.enrolled > 1)
    .map(_.property('grade'))
    .mean()
    .value();
};
