import { Router } from 'express';
import validateApiKey from '../middlewares/apiKeyValidator';
import validateSchema from '../middlewares/validateSchema';
import * as cardSchemas from '../schemas/cardSchemas';
import * as cardController from '../controllers/cardController';

const routes = Router();

routes.post(
  '/:id/activate',
  validateSchema(cardSchemas.id, 'params'),
  validateSchema(cardSchemas.activateCard, 'body'),
  cardController.activate
);

routes.post(
  '/:id/block',
  validateSchema(cardSchemas.id, 'params'),
  validateSchema(cardSchemas.password, 'body'),
  cardController.block
);

routes.get(
  '/:id/balance',
  validateSchema(cardSchemas.id, 'params'),
  cardController.balance
);

routes.use(validateApiKey);

routes.post(
  '/:id/recharge',
  validateSchema(cardSchemas.id, 'params'),
  validateSchema(cardSchemas.recharge, 'body'),
  cardController.recharge
);

routes.post(
  '/',
  validateSchema(cardSchemas.newCard, 'body'),
  cardController.create
);

export default routes;
