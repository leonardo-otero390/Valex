import { Router } from 'express';
import validateSchema from '../middlewares/validateSchema';
import * as businessSchemas from '../schemas/businessSchemas';
import * as businessController from '../controllers/businessController';

const routes = Router();

routes.post(
  '/:id/payment',
  validateSchema(businessSchemas.id, 'params'),
  validateSchema(businessSchemas.payment, 'body'),
  businessController.payment
);

export default routes;
