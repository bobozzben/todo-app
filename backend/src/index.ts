import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authMiddleware } from './middleware/auth';
import { notFound } from './middleware/notFound';
import { errorHandler } from './middleware/errorHandler';
import { ensureDatabaseSetup } from './dbSetup';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

const port = process.env.PORT || 4000;

async function main() {
  try {
    await ensureDatabaseSetup();

    const authRouter = (await import('./routes/auth')).default;
    const tasksRouter = (await import('./routes/tasks')).default;
    const usersRouter = (await import('./routes/users')).default;

    app.use('/api/auth', authRouter);
    app.use('/api/tasks', authMiddleware, tasksRouter);
    app.use('/api/users', authMiddleware, usersRouter);

    app.use(notFound);
    app.use(errorHandler);

    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  } catch (err) {
    console.error('Failed to initialize application:', err);
    process.exit(1);
  }
}

main();

export default app;

