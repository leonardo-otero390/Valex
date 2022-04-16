import { Router } from 'express';
import cardsRouter from './cards.routes';

const routes = Router();

routes.get('/health', async (req, res) => {
  res.sendStatus(200);
});
routes.use('/cards', cardsRouter);

export default routes;
