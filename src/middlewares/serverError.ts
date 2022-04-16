/* eslint-disable no-console */
import { Request, Response, NextFunction } from 'express';
import HttpError from '../errors/HttpError';

export default function serverError(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof HttpError) {
    return res.status(err.status).send(err.message);
  }
  console.log(err.message);
  res.sendStatus(500);
  return next();
}
