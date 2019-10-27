import {
  DatabaseStore,
  ArrayStore,
  fetchStudentFromDb,
  fetchStudentFromArray,
} from 'src/chapter4/Chapter4';

/**
 * 第4章 モジュール化によるコードの再利用のテスト
 * カリー化を利用した関数ファクトリの実装
 */
describe('Chapter4.findStudent', () => {
  /**
   * DBオブジェクトから学生が取得出来ること
   */
  it('should be able to find student from db', () => {
    const database = new DatabaseStore();

    // Databaseから学生を検索する関数を作成
    // ※ まあ実際ただ配列から取っているだけだけどデータベースから取っていると仮定して
    const findStudent = fetchStudentFromDb(database);

    const expectedStudent = {
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

    expect(findStudent('111-11-1111')).toEqual(expectedStudent);
  });

  /**
   * 配列から学生オブジェクトを取得出来ること
   */
  it('should be able to find student from array', () => {
    const arrayStore = new ArrayStore();

    const findStudent = fetchStudentFromArray(arrayStore);

    const expectedStudent = {
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

    expect(findStudent('111-11-1111')).toEqual(expectedStudent);
  });
});
