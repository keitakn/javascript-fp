import { identity } from 'src/chapter4/Chapter4';

describe('Chapter4.FunctionCombinator', () => {
  it('should return the same value', () => {
    expect(identity<string>('value')).toStrictEqual('value');

    type User = {
      email: string;
      name: string;
    };

    const testUser: User = {
      email: 'test@gmail.com',
      name: 'TestUser',
    };

    expect(identity<User>(testUser)).toStrictEqual(testUser);
  });
});
