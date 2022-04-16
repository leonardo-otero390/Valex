import { Router } from 'express';
import validateApiKey from '../middlewares/apiKeyValidator';
import validateSchema from '../middlewares/validateSchema';
import cardReqSchema from '../schemas/cardReqSchema';
import * as cardController from '../controllers/cardController';

const routes = Router();

routes.use(validateApiKey);

routes.post('/', validateSchema(cardReqSchema), cardController.create);

export default routes;
