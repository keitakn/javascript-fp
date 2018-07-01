import { Address } from "../domain/types/Address";

/**
 * 第2章 関数型言語としてのJavaScript
 */
export namespace Chapter2 {
  /**
   * 郵送先住所（formatted）を生成する
   *
   * e.g. "JP 〒1000014 東京都東京都千代田区永田町１丁目７−１
   *
   * @param {Address} address
   * @returns {string}
   */
  export const generateFormattedAddress = (address: Address) => {
    return `${address.country} 〒${address.postalCode} ${address.region}${
      address.locality
    }${address.streetAddress}`;
  };


}
