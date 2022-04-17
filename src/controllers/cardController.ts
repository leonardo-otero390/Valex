import { Request, Response } from 'express';
import * as employeeService from '../services/employeeService';
import * as cardService from '../services/cardService';

export async function create(req: Request, res: Response) {
  const employeeId = Number(req.body.employeeId);
  if (Number.isNaN(employeeId)) {
    return res.status(400).send('Invalid employeeId');
  }
  const employee = await employeeService.find(employeeId);
  const { company } = res.locals;
  if (employee.companyId !== company.id) {
    return res.status(403).send('Employee not from this company');
  }
  const { type } = req.body;
  if (await cardService.employeeAlreadyHasCard(employeeId, type)) {
    return res.status(400).send(`Employee already has ${type} card`);
  }
  const card = await cardService.create(employee, type);

  return res.status(201).send(card);
}

export async function activate(req: Request, res: Response) {
  const { number } = req.params;
  const { cvc, password } = req.body;
  await cardService.activate(number, cvc, password);

  return res.sendStatus(200);
}
