import faker from '@faker-js/faker';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import bcrypt from 'bcrypt';
import { Employee } from '../interfaces/Employee';
import { TransactionTypes } from '../types/TransactionTypes';
import * as cardRepository from '../repositories/cardRepository';
import * as rechargeRepository from '../repositories/rechargeRepository';
import * as paymentRepository from '../repositories/paymentRepository';
import NotFound from '../errors/NotFoundError';
import Conflict from '../errors/ConflictError';
import Unauthorized from '../errors/UnauthorizedError';
import Forbidden from '../errors/Forbidden';

export async function find(id: number) {
  const card = await cardRepository.findById(id);
  if (!card) throw new NotFound('Card not found');
  return card;
}

export async function findByNumber(number: string) {
  const card = await cardRepository.findByNumber(number);
  if (!card) throw new NotFound('Card not found');
  return card;
}

export function checkExpiration(expirationDate: string) {
  dayjs.extend(customParseFormat);
  const date = dayjs(expirationDate, 'MM/YY');
  if (dayjs(date).isBefore(dayjs())) throw new Forbidden('Card is expired');
}

async function findAndValidatePasswordReturningBlockStatus(
  id: number,
  password: string
) {
  const {
    isBlocked,
    expirationDate,
    password: hashedPassword,
  } = await find(id);
  checkExpiration(expirationDate);
  if (!hashedPassword) throw new Forbidden('Card is not active');
  if (!bcrypt.compareSync(password, hashedPassword)) {
    throw new Unauthorized('Password is incorrect');
  }
  return isBlocked;
}

export async function unblock(id: number, password: string) {
  const isBlocked = await findAndValidatePasswordReturningBlockStatus(
    id,
    password
  );

  if (!isBlocked) throw new Conflict('Card is not blocked');
  await cardRepository.update(id, { isBlocked: false });
}

export async function block(id: number, password: string) {
  const isBlocked = await findAndValidatePasswordReturningBlockStatus(
    id,
    password
  );

  if (!isBlocked) throw new Conflict('Card is not blocked');
  await cardRepository.update(id, { isBlocked: true });
}

function formatHolderName(fullName: string) {
  const names = fullName.split(' ');
  const firstName = names[0];
  const lastName = names[names.length - 1];
  const middleNames = names
    .slice(1, names.length - 1)
    .filter((name) => name.length > 2)
    .map((name) => name.charAt(0).toUpperCase());
  return `${firstName} ${middleNames.join(' ')} ${lastName}`;
}

function genCreditCardNumber() {
  return faker.finance.creditCardNumber('mastercard').replace(/\s|-/g, '');
}

async function generateUniqueCardNumber() {
  let number = genCreditCardNumber();
  // eslint-disable-next-line no-await-in-loop
  while (await cardRepository.findByNumber(number)) {
    number = genCreditCardNumber();
  }
  return number;
}

export async function employeeAlreadyHasCard(
  employeeId: number,
  type: TransactionTypes
) {
  return !!(await cardRepository.findByTypeAndEmployeeId(type, employeeId));
}

export async function create(employee: Employee, type: TransactionTypes) {
  if (await employeeAlreadyHasCard(employee.id, type)) {
    throw new Conflict(`Employee already has ${type} card`);
  }
  const creditCardCVV = faker.finance.creditCardCVV();

  const card = {
    number: await generateUniqueCardNumber(),
    employeeId: employee.id,
    cardholderName: formatHolderName(employee.fullName),
    securityCode: bcrypt.hashSync(creditCardCVV, 10),
    expirationDate: dayjs().add(5, 'year').format('MM/YY'),
    isVirtual: false,
    isBlocked: false,
    type,
  };

  const { id } = await cardRepository.insert(card);

  card.securityCode = creditCardCVV;
  return { ...card, id };
}

export async function activate(
  id: number,
  securityCode: string,
  password: string
) {
  const card = await find(id);
  if (card.password) throw new Conflict('Card already activated');
  if (!bcrypt.compareSync(securityCode, card.securityCode)) {
    throw new Unauthorized('Security code is incorrect');
  }

  await cardRepository.update(card.id, {
    password: bcrypt.hashSync(password, 10),
  });
}

export async function balance(id: number) {
  const recharges = await rechargeRepository.findByCardId(id);
  const payments = await paymentRepository.findByCardId(id);
  const totalRecharges = recharges.reduce((acc, rech) => acc + rech.amount, 0);
  const totalPayments = payments.reduce((acc, pay) => acc + pay.amount, 0);
  const total = totalRecharges - totalPayments;
  return { balance: total, transactions: payments, recharges };
}
