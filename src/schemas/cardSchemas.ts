import Joi from 'joi';

export const newCard = Joi.object({
  employeeId: Joi.number().required(),
  type: Joi.string()
    .valid('groceries', 'restaurant', 'transport', 'education', 'health')
    .required(),
});

export const activateCard = Joi.object({
  cvc: Joi.string().length(3).required(),
  password: Joi.string().length(4).pattern(/\d/).required(),
});

export const id = Joi.object({
  id: Joi.number().required(),
});

export const recharge = Joi.object({
  amount: Joi.number().greater(0).required(),
});

export const password = Joi.object({
  password: Joi.string().required(),
});
