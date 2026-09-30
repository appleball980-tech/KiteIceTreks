import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../../lib/prisma.js';
import { HttpError, notFound } from '../../lib/http-error.js';
import { hashPassword } from '../../lib/password.js';
import { validate } from '../../middleware/validate.js';
import { publicUserSelect } from '../../middleware/auth.js';
import { idParams } from '../schemas.js';

export const passwordSchema = z.string().min(10, 'Password must be at least 10 characters').max(200);

const userSchema = z.object({
  email: z.email().trim().toLowerCase().max(190),
  name: z.string().trim().min(1).max(120),
  password: passwordSchema,
  role: z.enum(['admin', 'editor']).optional(),
  isActive: z.boolean().optional(),
});

// Admin-only (enforced where this router is mounted)
export const adminUsersRouter = Router()
  .get('/', async (_req, res) => {
    res.json({ data: await prisma.user.findMany({ select: publicUserSelect, orderBy: { createdAt: 'asc' } }) });
  })
  .post('/', validate({ body: userSchema }), async (req, res) => {
    const { password, ...data } = req.valid.body;
    const user = await prisma.user.create({ data: { ...data, passwordHash: await hashPassword(password) }, select: publicUserSelect });
    res.status(201).json({ data: user });
  })
  .patch('/:id', validate({ params: idParams, body: userSchema.partial() }), async (req, res) => {
    const { id } = req.valid.params;
    const { password, ...data } = req.valid.body;
    if (id === req.user.id && (data.isActive === false || data.role === 'editor')) {
      throw new HttpError(400, 'You cannot deactivate or demote your own account');
    }
    const user = await prisma.user.update({
      where: { id },
      data: {
        ...data,
        ...(password && { passwordHash: await hashPassword(password) }),
        // Log the user out everywhere when their password or access changes
        ...((password || data.isActive === false || data.role) && { tokenVersion: { increment: 1 } }),
      },
      select: publicUserSelect,
    });
    res.json({ data: user });
  })
  .delete('/:id', validate({ params: idParams }), async (req, res) => {
    if (req.valid.params.id === req.user.id) throw new HttpError(400, 'You cannot delete your own account');
    const deleted = await prisma.user.deleteMany({ where: { id: req.valid.params.id } });
    if (!deleted.count) throw notFound('User');
    res.status(204).end();
  });
