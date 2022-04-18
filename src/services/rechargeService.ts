import * as cardService from './cardService';
import * as rechargeRepository from '../repositories/rechargeRepository';

export async function create(id: number, amount: number) {
  const { expirationDate } = await cardService.find(id);
  cardService.checkExpiration(expirationDate);
  await rechargeRepository.insert({ cardId: id, amount: Math.trunc(amount) });
}
