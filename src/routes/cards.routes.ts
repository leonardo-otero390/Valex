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

routes.use(validateApiKey);

routes.post(
  '/',
  validateSchema(cardSchemas.newCard, 'body'),
  cardController.create
);

export default routes;
