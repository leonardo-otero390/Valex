import { Request, Response } from 'express';
import * as employeeService from '../services/employeeService';
import * as cardService from '../services/cardService';
import * as paymentyService from '../services/paymentService';

export async function create(req: Request, res: Response) {
  const { employeeId } = req.body;
  const employee = await employeeService.find(employeeId);
  const { company } = res.locals;
  if (employee.companyId !== company.id) {
    return res.status(403).send('Employee not from this company');
  }
  const { type } = req.body;
  const card = await cardService.create(employee, type);

  return res.status(201).send(card);
}

export async function activate(req: Request, res: Response) {
  const { number } = req.params;
  const { cvc, password } = req.body;
  await cardService.activate(number, cvc, password);

  return res.sendStatus(200);
}

export async function recharge(req: Request, res: Response) {
  const { number } = req.params;
  const { amount } = req.body;
  await cardService.recharge(number, amount);

  return res.sendStatus(201);
}

export async function payment(req: Request, res: Response) {
  const { number } = req.params;
  const { amount, password, businessId } = req.body;
  await paymentyService.create({
    cardNumber: number,
    amount,
    password,
    businessId,
  });

  return res.sendStatus(201);
}

export async function balance(req: Request, res: Response) {
  const { number } = req.params;
  const result = await cardService.balance(number);

  return res.send(result);
}
