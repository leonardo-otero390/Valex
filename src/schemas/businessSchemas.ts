import Joi from 'joi';

export const id = Joi.object({
  id: Joi.number().required(),
});

export const payment = Joi.object({
  amount: Joi.number().greater(0).required(),
  cardNumber: Joi.string()
    .pattern(/\d{16}/)
    .length(16)
    .required(),
  password: Joi.string().required(),
});

export const onlinePayment = Joi.object({
  amount: Joi.number().greater(0).required(),
  cardNumber: Joi.string()
    .pattern(/\d{16}/)
    .length(16)
    .required(),
  expirationDate: Joi.string()
    .pattern(/^[0-1]\d[/]\d{2}$/)
    .length(5)
    .required(),
  cvc: Joi.string().length(3).pattern(/\d/).required(),
  name: Joi.string().min(3).required(),
});
