import { Router } from 'express';
import validateApiKey from '../middlewares/apiKeyValidator';
import validateSchema from '../middlewares/validateSchema';
import * as cardSchemas from '../schemas/cardSchemas';
import * as cardController from '../controllers/cardController';

const routes = Router();

routes.post(
  '/:number/activate',
  validateSchema(cardSchemas.number, 'params'),
  validateSchema(cardSchemas.activateCard, 'body'),
  cardController.activate
);

routes.post(
  '/:number/payment',
  validateSchema(cardSchemas.number, 'params'),
  validateSchema(cardSchemas.payment, 'body'),
  cardController.payment
);

routes.post(
  '/:number/block',
  validateSchema(cardSchemas.number, 'params'),
  validateSchema(cardSchemas.password, 'body'),
  cardController.block
);

routes.get(
  '/:number/balance',
  validateSchema(cardSchemas.number, 'params'),
  cardController.balance
);

routes.use(validateApiKey);

routes.post(
  '/:number/recharge',
  validateSchema(cardSchemas.number, 'params'),
  validateSchema(cardSchemas.recharge, 'body'),
  cardController.recharge
);

routes.post(
  '/',
  validateSchema(cardSchemas.newCard, 'body'),
  cardController.create
);

export default routes;
