import faker from '@faker-js/faker';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import bcrypt from 'bcrypt';
import { Employee } from '../interfaces/Employee';
import { TransactionTypes } from '../types/TransactionTypes';
import * as cardRepository from '../repositories/cardRepository';
import * as rechargeRepository from '../repositories/rechargeRepository';
import NotFound from '../errors/NotFoundError';
import Conflict from '../errors/ConflictError';
import Unauthorized from '../errors/UnauthorizedError';
import Forbidden from '../errors/Forbidden';

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

export async function create(employee: Employee, type: TransactionTypes) {
  const creditCardCVV = faker.finance.creditCardCVV();

  const card = {
    number: await generateUniqueCardNumber(),
    employeeId: employee.id,
    cardholderName: formatHolderName(employee.fullName),
    securityCode: bcrypt.hashSync(creditCardCVV, 10),
    expirationDate: dayjs().add(5, 'year').format('MM/YY'),
    isVirtual: false,
    isBlocked: true,
    type,
  };

  await cardRepository.insert(card);

  card.securityCode = creditCardCVV;
  return card;
}

export async function employeeAlreadyHasCard(
  employeeId: number,
  type: TransactionTypes
) {
  return !!(await cardRepository.findByTypeAndEmployeeId(type, employeeId));
}

async function findByNumber(number: string) {
  const card = await cardRepository.findByNumber(number);
  if (!card) throw new NotFound('Card not found');
  return card;
}

export async function activate(
  number: string,
  securityCode: string,
  password: string
) {
  const card = await findByNumber(number);
  if (card.password) throw new Conflict('Card already activated');
  if (!bcrypt.compareSync(securityCode, card.securityCode)) {
    throw new Unauthorized('Security code is incorrect');
  }

  await cardRepository.update(card.id, {
    password: bcrypt.hashSync(password, 10),
  });
}

function isExpired(expirationDate: string) {
  dayjs.extend(customParseFormat);
  const date = dayjs(expirationDate, 'MM/YY');
  return dayjs(date).isBefore(dayjs());
}

export async function recharge(number: string, amount: number) {
  const { id, expirationDate } = await findByNumber(number);
  if (isExpired(expirationDate)) throw new Forbidden('Card is expired');
  await rechargeRepository.insert({ cardId: id, amount: Math.trunc(amount) });
}
