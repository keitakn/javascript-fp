import { Address } from "./Address";

/**
 * 人を表すオブジェクトIF
 */
export interface Person {
  ssn: string;
  givenName: string;
  familyName: string;
  birthdate: string;
  address: Address;
}
