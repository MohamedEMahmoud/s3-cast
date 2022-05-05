import express from 'express';
import bodyParser from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler } from './middlewares/error-handler.middleware';
import { usersRouter } from './routers/user.route';
import dotenv from 'dotenv';
import { currentUser } from './middlewares/current-user.middleware';
dotenv.config();

const app: express.Application = express();

app.use([
  bodyParser.json(),
  cookieSession({ signed: false }),
  currentUser,
  usersRouter,
]);

app.use('*', errorHandler);

export default app;
