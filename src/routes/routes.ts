import { Router } from 'express';
import cardsRouter from './cards.routes';
import businessRouter from './business.routes';

const routes = Router();

routes.get('/health', async (req, res) => {
  res.sendStatus(200);
});
routes.use('/cards', cardsRouter);
routes.use('/business', businessRouter);

export default routes;
