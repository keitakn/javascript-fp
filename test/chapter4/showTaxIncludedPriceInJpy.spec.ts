import { showTaxIncludedPriceInJpy } from 'src/chapter4/Chapter4';

/**
 * 第4章 モジュール化によるコードの再利用のテスト
 *
 * 関数パイプラインの利用
 */
describe('Chapter4.showTaxIncludedPriceInJpy', () => {
  /**
   * 税込み価格が表示される事をテスト
   */
  it('should show the price including tax', () => {
    expect(showTaxIncludedPriceInJpy(1000)).toStrictEqual('¥1,100');
  });
});
