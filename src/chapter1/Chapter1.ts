/**
 * 第1章 関数型で思考する
 */
export namespace Chapter1 {
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
}
