import bcrypt from 'bcrypt';
import Forbidden from '../errors/Forbidden';
import { PaymentReq } from '../interfaces/PaymentReq';
import * as cardService from './cardService';
import * as businessService from './businessService';
import Unauthorized from '../errors/UnauthorizedError';

export async function create(paymentReq: PaymentReq) {
  const { cardNumber, password, businessId } = paymentReq;
  const {
    expirationDate,
    password: hashedPassword,
    type: cardType,
  } = await cardService.findByNumber(cardNumber);
  cardService.checkExpiration(expirationDate);

  const { type: businessesType } = await businessService.find(businessId);
  if (businessesType !== cardType) {
    throw new Forbidden('Card type is not valid');
  }
  if (!bcrypt.compareSync(password, hashedPassword)) {
    throw new Unauthorized('Password is incorrect');
  }
}
