import { Router } from 'express';
import { z } from 'zod';
import { rateLimit } from 'express-rate-limit';
import { prisma } from '../lib/prisma.js';
import { HttpError } from '../lib/http-error.js';
import { signToken } from '../lib/jwt.js';
import { DUMMY_HASH, hashPassword, verifyPassword } from '../lib/password.js';
import { validate } from '../middleware/validate.js';
import { publicUserSelect, requireAuth } from '../middleware/auth.js';
import { passwordSchema } from './admin/users.routes.js';

// Slows down password guessing: 10 failed attempts per 15 minutes per IP
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  skipSuccessfulRequests: true,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: { message: 'Too many login attempts, please try again in 15 minutes.' } },
});

const loginBody = z.object({
  email: z.email().trim().toLowerCase(),
  password: z.string().min(1).max(200),
});

export const authRouter = Router()
  // POST /auth/login { email, password } -> { token, user }
  .post('/login', loginLimiter, validate({ body: loginBody }), async (req, res) => {
    const { email, password } = req.valid.body;
    const user = await prisma.user.findUnique({ where: { email } });

    // Always run a hash comparison so timing doesn't reveal whether the email exists
    const valid = await verifyPassword(password, user?.passwordHash ?? DUMMY_HASH);
    if (!user || !valid || !user.isActive) throw new HttpError(401, 'Incorrect email or password');

    await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
    const token = await signToken(user);
    res.json({ data: { token, user: await prisma.user.findUnique({ where: { id: user.id }, select: publicUserSelect }) } });
  })
  .get('/me', requireAuth, (req, res) => {
    res.json({ data: req.user });
  })
  // Changing your password logs out your other sessions; the response includes a fresh token
  .patch(
    '/me/password',
    requireAuth,
    validate({ body: z.object({ currentPassword: z.string().min(1).max(200), newPassword: passwordSchema }) }),
    async (req, res) => {
      const { currentPassword, newPassword } = req.valid.body;
      const user = await prisma.user.findUnique({ where: { id: req.user.id } });
      if (!(await verifyPassword(currentPassword, user.passwordHash))) throw new HttpError(400, 'Current password is incorrect');

      const updated = await prisma.user.update({
        where: { id: user.id },
        data: { passwordHash: await hashPassword(newPassword), tokenVersion: { increment: 1 } },
      });
      res.json({ data: { token: await signToken(updated) } });
    }
  );
