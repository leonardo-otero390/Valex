import { Request, Response } from 'express';
import * as employeeService from '../services/employeeService';
import * as cardService from '../services/cardService';
import * as paymentService from '../services/paymentService';
import * as rechargeService from '../services/rechargeService';

export async function block(req: Request, res: Response) {
  const id = Number(req.params.id);
  const { password } = req.body;
  await cardService.block(id, password);
  res.sendStatus(200);
}

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
  const id = Number(req.params.id);
  const { cvc, password } = req.body;
  await cardService.activate(id, cvc, password);

  return res.sendStatus(200);
}

export async function recharge(req: Request, res: Response) {
  const id = Number(req.params.id);
  const { amount } = req.body;
  await rechargeService.create(id, amount);

  return res.sendStatus(201);
}

export async function payment(req: Request, res: Response) {
  const { number } = req.params;
  const { amount, password, businessId } = req.body;
  await paymentService.create({
    cardNumber: number,
    amount,
    password,
    businessId,
  });

  return res.sendStatus(201);
}

export async function balance(req: Request, res: Response) {
  const id = Number(req.params.id);
  const result = await cardService.balance(id);

  return res.send(result);
}
