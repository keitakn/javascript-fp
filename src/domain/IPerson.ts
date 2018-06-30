import { IAddress } from "./IAddress";

/**
 * 人を表すオブジェクトIF
 */
export interface IPerson {
  ssn: string;
  givenName: string;
  familyName: string;
  birthdate: string;
  address: IAddress;
}
