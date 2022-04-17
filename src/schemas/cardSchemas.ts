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

export const number = Joi.object({
  number: Joi.string().length(16).pattern(/\d/).required(),
});
