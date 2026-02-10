import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import tasksRouter from './routes/tasks';
import authRouter from './routes/auth';
import { notFound } from './middleware/notFound';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/tasks', tasksRouter);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

export default app;

