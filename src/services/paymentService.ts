import bcrypt from 'bcrypt';
import Forbidden from '../errors/Forbidden';
import { PaymentReq } from '../interfaces/PaymentReq';
import * as cardService from './cardService';
import * as businessService from './businessService';
import * as paymentRepository from '../repositories/paymentRepository';
import Unauthorized from '../errors/UnauthorizedError';

async function checkBalance(amount: number, id: number) {
  const { balance } = await cardService.balance(id);
  if (balance < amount) {
    throw new Forbidden('Insufficient funds');
  }
}

export async function create(paymentReq: PaymentReq) {
  const { cardNumber, password, businessId, amount } = paymentReq;
  const {
    id: cardId,
    expirationDate,
    password: hashedPassword,
    type: cardType,
  } = await cardService.findByNumber(cardNumber);
  cardService.checkExpiration(expirationDate);
  if (!hashedPassword) throw new Forbidden('Card is not active');
  const { type: businessesType } = await businessService.find(businessId);
  if (businessesType !== cardType) {
    throw new Forbidden('Card type is not valid');
  }
  if (!bcrypt.compareSync(password, hashedPassword)) {
    throw new Unauthorized('Password is incorrect');
  }

  await checkBalance(amount, cardId);
  await paymentRepository.insert({ cardId, amount, businessId });
}
