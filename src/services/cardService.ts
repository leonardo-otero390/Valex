import faker from '@faker-js/faker';
import dayjs from 'dayjs';
import bcrypt from 'bcrypt';
import { Employee } from '../interfaces/Employee';
import { TransactionTypes } from '../types/TransactionTypes';
import * as cardRepository from '../repositories/cardRepository';

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

async function generateUniqueCardNumber() {
  let number = faker.finance.creditCardNumber();
  // eslint-disable-next-line no-await-in-loop
  while (await cardRepository.findByNumber(number)) {
    number = faker.finance.creditCardNumber();
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
