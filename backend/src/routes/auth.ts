import { Router } from 'express';
import bcrypt from 'bcrypt';
import prisma from '../prismaClient';
import { registerSchema, loginSchema, updateUserSchema } from '../validators/taskValidator';
import { generateToken } from '../auth/jwt';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Register
router.post('/register', async (req, res, next) => {
  try {
    const parsed = registerSchema.parse(req.body);

    // Check if user exists
    const existing = await prisma.user.findUnique({ where: { email: parsed.email } });
    if (existing) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(parsed.password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: parsed.email,
        name: parsed.name,
        password: hashedPassword,
      },
    });

    // Generate token
    const token = generateToken(user.id, user.email);

    res.status(201).json({ token, user: { id: user.id, email: user.email, name: user.name } });
  } catch (err) {
    next(err);
  }
});

// Login
router.post('/login', async (req, res, next) => {
  try {
    const parsed = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email: parsed.email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const valid = await bcrypt.compare(parsed.password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken(user.id, user.email);
    res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
  } catch (err) {
    next(err);
  }
});

// Get current user
router.get('/me', authMiddleware, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { id: true, email: true, name: true, createdAt: true },
    });
    res.json(user);
  } catch (err) {
    next(err);
  }
});

// Update user
router.put('/me', authMiddleware, async (req, res, next) => {
  try {
    const parsed = updateUserSchema.parse(req.body);

    const data: any = {};
    if (parsed.name) data.name = parsed.name;
    if (parsed.password) data.password = await bcrypt.hash(parsed.password, 10);

    const user = await prisma.user.update({
      where: { id: req.userId },
      data,
      select: { id: true, email: true, name: true, createdAt: true },
    });

    res.json(user);
  } catch (err) {
    next(err);
  }
});

export default router;
