import { TransactionTypes } from '../types/TransactionTypes';

export interface Business {
  id: number;
  name: string;
  type: TransactionTypes;
}
