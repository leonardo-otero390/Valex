import Joi from 'joi';

export const id = Joi.object({
  id: Joi.number().required(),
});

export const payment = Joi.object({
  amount: Joi.number().greater(0).required(),
  cardNumber: Joi.string().length(16).pattern(/\d/).required(),
  password: Joi.string().required(),
});
