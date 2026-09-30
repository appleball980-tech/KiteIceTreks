import { prisma } from '../lib/prisma.js';
import { verifyToken } from '../lib/jwt.js';
import { HttpError } from '../lib/http-error.js';

export const publicUserSelect = { id: true, email: true, name: true, role: true, isActive: true, lastLoginAt: true, createdAt: true };

// Requires `Authorization: Bearer <token>` from POST /auth/login.
// The user is re-checked on every request so deactivating a user or changing
// their password takes effect immediately.
export async function requireAuth(req, _res, next) {
  const [scheme, token] = (req.get('authorization') ?? '').split(' ');
  if (scheme !== 'Bearer' || !token) return next(new HttpError(401, 'Authentication required'));

  let payload;
  try {
    payload = await verifyToken(token);
  } catch {
    return next(new HttpError(401, 'Invalid or expired token'));
  }

  const user = await prisma.user.findUnique({
    where: { id: Number(payload.sub) },
    select: { ...publicUserSelect, tokenVersion: true },
  });
  if (!user || !user.isActive || user.tokenVersion !== payload.ver) {
    return next(new HttpError(401, 'Session is no longer valid, please log in again'));
  }

  const { tokenVersion: _ignored, ...publicUser } = user;
  req.user = publicUser;
  next();
}

export const requireRole = (...roles) => (req, _res, next) =>
  roles.includes(req.user?.role) ? next() : next(new HttpError(403, 'You do not have permission to do this'));
