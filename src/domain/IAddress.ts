/**
 * 住所を表すオブジェクトIF
 *
 * @link http://openid-foundation-japan.github.io/openid-connect-core-1_0.ja.html#AddressClaim
 */
export interface IAddress {
  country: string;
  postalCode: string;
  region: string;
  locality: string;
  streetAddress: string;
}
