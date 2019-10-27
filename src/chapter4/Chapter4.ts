import * as R from 'ramda';
import { getLogger, configure } from 'log4js';
import { Students } from '../domain/types/Students';
import { Student } from '../domain/types/Student';

// 第4章 モジュール化によるコードの再利用

/**
 * 実際は単に決められた値を返しているだけだがDBから取得していると仮定
 */
export class DatabaseStore {
  private readonly students: Students;

  constructor() {
    const student = {
      ssn: '111-11-1111',
      givenName: 'keita',
      familyName: 'kn',
      birthdate: '2000-01-01',
      address: {
        country: 'US',
        postalCode: '926660',
        region: 'CA',
        locality: 'Irvine',
        streetAddress: '123 A St. Apt#1',
      },
      school: 'Fラン',
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
    if (ssn === '111-11-1111') {
      return this.students[0];
    }

    throw new Error('NotFound');
  }
}

/**
 * 配列から学生を検索する
 */
export class ArrayStore {
  private readonly students: Students;

  constructor() {
    const student = {
      ssn: '111-11-1111',
      givenName: 'keita',
      familyName: 'kn',
      birthdate: '2000-01-01',
      address: {
        country: 'US',
        postalCode: '926660',
        region: 'CA',
        locality: 'Irvine',
        streetAddress: '123 A St. Apt#1',
      },
      school: 'Fラン',
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
    if (ssn === '111-11-1111') {
      return this.students[0];
    }

    throw new Error('NotFound');
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
  },
);

/**
 * 配列から学生を検索する
 *
 * @type {R.CurriedFunction2<Chapter4.ArrayStore, string, Student>}
 */
export const fetchStudentFromArray = R.curry(
  (store: ArrayStore, ssn: string) => {
    return store.find(ssn);
  },
);

/**
 * @param {string} level
 * @param message
 */
export const logger = (level: string, message: string | Error) => {
  configure({
    appenders: {
      out: {
        type: 'stdout',
        layout: {
          type: 'coloured',
        },
      },
    },
    categories: {
      default: {
        level,
        appenders: ['out'],
      },
    },
  });

  const logger = getLogger('javascript-fp');

  logger.log(level, message);
};

/**
 * 価格を検証する
 *
 * 実装が関数の名前と合っていないが、パイプラインのテストを単純化する為、あえてこうしてある
 *
 * @param price
 */
const validatePrice = (price: number): number => {
  if (!Number.isInteger(price)) {
    return 0;
  }

  if (price < 100) {
    return 0;
  }

  return price;
};

/**
 * 税込み価格を計算する
 *
 * @param price
 */
const calculateTaxIncludedPrice = (price: number): number => {
  const tax = 1.1;

  return price * tax;
};

/**
 * 日本円形式で価格を表示する
 *
 * @param price
 */
const showPriceInJpy = (price: number): string => {
  const formatter = new Intl.NumberFormat('ja-JP');

  return `¥${formatter.format(price)}`;
};

/**
 * 日本円形式で税込み価格を表示する
 *
 * @param price
 */
export const showTaxIncludedPriceInJpy = (price: number): string => {
  const composed = R.pipe<
    number,
    ReturnType<typeof validatePrice>,
    ReturnType<typeof calculateTaxIncludedPrice>,
    ReturnType<typeof showPriceInJpy>
  >(
    validatePrice,
    calculateTaxIncludedPrice,
    showPriceInJpy,
  );

  return composed(price);
};
