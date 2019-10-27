import * as R from 'ramda';
import { logger } from '../../src/chapter4/Chapter4';

/**
 * 第4章 モジュール化によるコードの再利用のテスト
 * 再利用可能な関数テンプレート（Loggerクラスを使って実装）
 */
describe('Chapter4.logger', () => {
  /**
   * errorログが出力出来る事を確認する
   */
  it('should be able to output error log', () => {
    const errorLogger = R.curry(logger)('error');

    const error = new Error('ERROR TEST!!');

    errorLogger(error);
  });

  /**
   * infoログが出力出来る事を確認する
   */
  it('should be able to output info log', () => {
    const infoLogger = R.curry(logger)('info');

    const message = 'information from logger.spec.ts';

    infoLogger(message);
  });
});
