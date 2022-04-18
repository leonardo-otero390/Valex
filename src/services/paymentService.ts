import bcrypt from 'bcrypt';
import Forbidden from '../errors/Forbidden';
import { PaymentReq, OnlinePaymentReq } from '../interfaces/PaymentReq';
import * as cardService from './cardService';
import * as businessService from './businessService';
import * as paymentRepository from '../repositories/paymentRepository';
import Unauthorized from '../errors/UnauthorizedError';
import { Card } from '../interfaces/Card';

async function checkBalance(amount: number, id: number) {
  const { balance } = await cardService.balance(id);
  if (balance < amount) {
    throw new Forbidden('Insufficient funds');
  }
}

function checkReqInfoWithCardData(
  req: Omit<OnlinePaymentReq, 'businessId' | 'amount'>,
  card: Card
) {
  if (
    req.expirationDate !== card.expirationDate ||
    req.name !== card.cardholderName
  ) {
    throw new Unauthorized('Invalid data');
  }
}

function checkBlockAndActiveStatus(isBlocked: boolean, isActive: any) {
  if (isBlocked) throw new Forbidden('Card is blocked');
  if (!isActive) throw new Forbidden('Card is not active');
}

function checkType(businessesType: string, cardType: string) {
  if (businessesType !== cardType) {
    throw new Forbidden('Card type is not valid');
  }
}

export async function createOnline(paymentReq: OnlinePaymentReq) {
  const { cardNumber, businessId, amount, cvc, expirationDate } = paymentReq;
  cardService.checkExpiration(expirationDate);
  const card = await cardService.findByNumber(cardNumber);
  checkReqInfoWithCardData(paymentReq, card);
  const {
    isBlocked,
    password: hashedPassword,
    type: cardType,
    securityCode,
    id: cardId,
  } = card;
  checkBlockAndActiveStatus(isBlocked, hashedPassword);
  const { type: businessesType } = await businessService.find(businessId);
  checkType(businessesType, cardType);
  if (!bcrypt.compareSync(cvc, securityCode)) {
    throw new Unauthorized('Security code is incorrect');
  }

  await checkBalance(amount, cardId);
  await paymentRepository.insert({ cardId, amount, businessId });
}

export async function create(paymentReq: PaymentReq) {
  const { cardNumber, password, businessId, amount } = paymentReq;
  const {
    id: cardId,
    expirationDate,
    password: hashedPassword,
    isBlocked,
    type: cardType,
  } = await cardService.findByNumber(cardNumber);
  checkBlockAndActiveStatus(isBlocked, hashedPassword);
  cardService.checkExpiration(expirationDate);
  const { type: businessesType } = await businessService.find(businessId);
  checkType(businessesType, cardType);
  if (!bcrypt.compareSync(password, hashedPassword)) {
    throw new Unauthorized('Password is incorrect');
  }

  await checkBalance(amount, cardId);
  await paymentRepository.insert({ cardId, amount, businessId });
}
