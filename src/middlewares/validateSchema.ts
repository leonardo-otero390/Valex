import { Request, Response, NextFunction } from 'express';
import { ObjectSchema } from 'joi';
import { ReqTypes } from '../types/ReqTypes';

export default function validateSchema(schema: ObjectSchema, method: ReqTypes) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req[method]);
    if (error) {
      return res.sendStatus(400);
    }
    return next();
  };
}
