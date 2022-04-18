import { Request, Response } from 'express';
import * as paymentService from '../services/paymentService';

export async function payment(req: Request, res: Response) {
  const id = Number(req.params.id);
  const { amount, password, cardNumber } = req.body;
  await paymentService.create({
    cardNumber,
    amount,
    password,
    businessId: id,
  });

  return res.sendStatus(201);
}
