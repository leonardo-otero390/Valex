import { Request, Response, NextFunction } from 'express';
import * as companyService from '../services/companyService';

export default async function validateApiKey(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const apiKey = req.headers['x-api-key']?.toString();

  if (!apiKey) {
    return res.status(401).send('x-api-key header is missing');
  }

  const company = await companyService.findByApiKey(apiKey);
  res.locals.company = company;
  return next();
}
