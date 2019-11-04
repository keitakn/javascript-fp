import {
  showTaxIncludedPriceInJpy,
  fetchFollowingTags,
} from '../../src/chapter5/Chapter5';

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

  it('should return tags', async () => {
    const resultEither = await fetchFollowingTags('keitakn');

    const expected = {
      _tag: 'Right',
      right: [
        { id: 'deno' },
        { id: 'Go' },
        { id: 'Node.js' },
        { id: 'TypeScript' },
        { id: 'serverless' },
      ],
    };

    expect(resultEither).toStrictEqual(expected);
  });

  it('should return an error because the user does not exist', async () => {
    const resultEither = await fetchFollowingTags('a');

    const expected = {
      _tag: 'Left',
      left: new Error('Request failed with status code 404'),
    };

    expect(resultEither).toStrictEqual(expected);
  });
});
