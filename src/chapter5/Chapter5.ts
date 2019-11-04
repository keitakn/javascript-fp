import { pipe, pipeP } from 'ramda';
import { Either, left, right, toError } from 'fp-ts/lib/Either';
import axios, { AxiosError, AxiosResponse } from 'axios';

export const Try = <T>(fn: () => T): Either<Error, T> => {
  try {
    const result = fn();

    return right(result);
  } catch (error) {
    return left(toError(error));
  }
};

export const TryAsync = async <T>(
  fn: () => Promise<T>,
): Promise<Either<Error, T>> => {
  return fn()
    .then(v => right<Error, T>(v))
    .catch(error => left<Error, T>(toError(error)));
};

const validatePrice = (price: Either<Error, number>): Either<Error, number> => {
  return Try<number>(() => {
    if (price._tag === 'Left') {
      throw price.left;
    }

    if (!Number.isInteger(price.right)) {
      throw new Error('price is Not Number!');
    }

    if (price.right < 100) {
      throw new Error('The price should specify more than 100!');
    }

    return price.right;
  });
};

const calculateTaxIncludedPrice = (
  price: Either<Error, number>,
): Either<Error, number> => {
  return Try<number>(() => {
    const tax = 1.1;

    if (price._tag === 'Left') {
      throw price.left;
    }

    return price.right * tax;
  });
};

const showPriceInJpy = (
  price: Either<Error, number>,
): Either<Error, string> => {
  return Try<string>(() => {
    const formatter = new Intl.NumberFormat('ja-JP');

    if (price._tag === 'Left') {
      throw price.left;
    }

    return `¥${formatter.format(price.right)}`;
  });
};

export const showTaxIncludedPriceInJpy = (
  price: number,
): Either<Error, string> => {
  const composed = pipe<
    Either<Error, number>,
    ReturnType<typeof validatePrice>,
    ReturnType<typeof calculateTaxIncludedPrice>,
    ReturnType<typeof showPriceInJpy>
  >(
    validatePrice,
    calculateTaxIncludedPrice,
    showPriceInJpy,
  );

  const eitherPrice = Try<number>(() => {
    return price;
  });

  return composed(eitherPrice);
};

export const httpClient = axios.create({
  baseURL: 'https://qiita.com',
  timeout: 10000,
});

type QiitaUser = {
  id: string;
};

const fetchQiitaUser = async (qiitaUser: QiitaUser) => {
  return TryAsync<QiitaUser>(() => {
    return httpClient
      .get<QiitaUser>(`/api/v2/users/${qiitaUser.id}`)
      .then((axiosResponse: AxiosResponse) => {
        return Promise.resolve(axiosResponse.data);
      })
      .catch((axiosError: AxiosError) => {
        // このような握りつぶしは良くないが動作確認を単純化する為にこうしておく
        return Promise.reject(new Error(axiosError.message));
      });
  });
};

type QiitaFollowingTag = {
  id: string;
};

const fetchQiitaUserFollowingTags = async (
  qiitaUser: Either<Error, QiitaUser>,
) => {
  return TryAsync<QiitaFollowingTag[]>(async () => {
    if (qiitaUser._tag === 'Left') {
      return Promise.reject(qiitaUser.left);
    }

    return httpClient
      .get<QiitaFollowingTag[]>(
        `/api/v2/users/${qiitaUser.right.id}/following_tags`,
      )
      .then((axiosResponse: AxiosResponse) => {
        const tags = axiosResponse.data.map(
          (qiitaFollowingTag: QiitaFollowingTag) => {
            return { id: qiitaFollowingTag.id };
          },
        );

        return Promise.resolve(tags);
      })
      .catch((axiosError: AxiosError) => {
        return Promise.reject(axiosError);
      });
  });
};

export const fetchFollowingTags = async (
  userId: string,
): Promise<Either<Error, QiitaUser[]>> => {
  /* eslint @typescript-eslint/no-explicit-any: 0 */
  const composed = pipeP<any, any, any>(
    fetchQiitaUser,
    fetchQiitaUserFollowingTags,
  );

  return composed({ id: userId });
};
