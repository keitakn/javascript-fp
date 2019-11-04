import { showTaxIncludedPriceInJpy } from '../../src/chapter5/Chapter5';

describe('Chapter5.monad', () => {
  it('should show the price including tax', () => {
    const resultEither = showTaxIncludedPriceInJpy(1000);

    const expected = {
      _tag: 'Right',
      right: '¥1,100',
    };

    expect(resultEither).toStrictEqual(expected);
  });

  it('should return an error because it is less than 100', () => {
    const resultEither = showTaxIncludedPriceInJpy(99);

    const expected = {
      _tag: 'Left',
      left: new Error('The price should specify more than 100!'),
    };

    expect(resultEither).toStrictEqual(expected);
  });
});
