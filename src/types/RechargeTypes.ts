import { Recharge } from '../interfaces/Recharge';

export type RechargeInsertData = Omit<Recharge, 'id' | 'timestamp'>;
