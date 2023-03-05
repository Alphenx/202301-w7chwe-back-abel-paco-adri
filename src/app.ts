import express from 'express';
import apiRouter from './api/api-router.js';
import cors from 'cors';
import bodyParser from 'body-parser';
import authRouter from './api/auth/auth-router.js';
import { authMiddleware } from './api/auth/auth-middleware.js';
import { errorHandler } from './utils/error-handler.js';

const app = express();
app.use(bodyParser.json());

app.get('/', (_req, res) => {
  res.json('Hello world');
});

app.use(cors());
app.use(express.json());
app.use('/auth', authRouter);
app.use('/api/v1', authMiddleware, apiRouter);

app.use(errorHandler);

export default app;
