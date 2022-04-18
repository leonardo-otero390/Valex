import * as cardService from './cardService';
import * as rechargeRepository from '../repositories/rechargeRepository';

export async function create(number: string, amount: number) {
  const { id, expirationDate } = await cardService.findByNumber(number);
  cardService.checkExpiration(expirationDate);
  await rechargeRepository.insert({ cardId: id, amount: Math.trunc(amount) });
}
