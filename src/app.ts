import express from 'express';
import 'express-async-errors';
import serverError from './middlewares/serverError';
import routes from './routes/routes';

const app = express();
app.use(express.json());
app.use(routes);
app.use(serverError);

export default app;
