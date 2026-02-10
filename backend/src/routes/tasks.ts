import { Router } from 'express';
import prisma from '../prismaClient';
import { taskCreateSchema } from '../validators/taskValidator';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/', authMiddleware, async (_req, res, next) => {
  try {
    const tasks = await prisma.task.findMany({
      where: { userId: _req.userId },
      orderBy: { createdAt: 'desc' },
    });
    res.json(tasks);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', authMiddleware, async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const task = await prisma.task.findUnique({ where: { id } });
    if (!task || task.userId !== req.userId) {
      return res.status(404).json({ error: 'Not found' });
    }
    res.json(task);
  } catch (err) {
    next(err);
  }
});

router.post('/', authMiddleware, async (req, res, next) => {
  try {
    const parsed = taskCreateSchema.parse(req.body);
    const created = await prisma.task.create({
      data: { ...parsed, userId: req.userId! },
    });
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', authMiddleware, async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const task = await prisma.task.findUnique({ where: { id } });
    if (!task || task.userId !== req.userId) {
      return res.status(404).json({ error: 'Not found' });
    }
    const parsed = taskCreateSchema.partial().parse(req.body);
    const updated = await prisma.task.update({ where: { id }, data: parsed });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const task = await prisma.task.findUnique({ where: { id } });
    if (!task || task.userId !== req.userId) {
      return res.status(404).json({ error: 'Not found' });
    }
    await prisma.task.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;

