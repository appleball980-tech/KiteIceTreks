import { MulterError } from 'multer';
import { HttpError } from '../lib/http-error.js';
import { env } from '../config/env.js';

export function notFoundHandler(req, _res, next) {
  next(new HttpError(404, `Route ${req.method} ${req.path} not found`));
}

// Turns known library errors into clean HTTP errors
function normalize(err) {
  if (err instanceof HttpError) return err;
  if (err.type === 'entity.parse.failed') return new HttpError(400, 'Invalid JSON body');
  if (err.type === 'entity.too.large') return new HttpError(413, 'Request body too large');
  if (err instanceof MulterError) {
    return new HttpError(err.code === 'LIMIT_FILE_SIZE' ? 413 : 400, err.code === 'LIMIT_FILE_SIZE' ? `File is larger than ${env.MAX_UPLOAD_MB} MB` : err.message);
  }
  // Prisma errors: https://www.prisma.io/docs/orm/reference/error-reference
  switch (err.code) {
    case 'P2002':
      return new HttpError(409, 'A record with this value already exists (check the slug/email is unique)');
    case 'P2003':
      return new HttpError(409, 'This record is linked to other records (or a linked record does not exist)');
    case 'P2025':
      return new HttpError(404, 'Record not found');
  }
  return err;
}

export function errorHandler(rawErr, req, res, _next) {
  const err = normalize(rawErr);
  const status = err instanceof HttpError ? err.status : 500;
  if (status >= 500) console.error(`[${req.method} ${req.originalUrl}]`, rawErr);

  res.status(status).json({
    error: {
      message: status >= 500 && env.isProduction ? 'Internal server error' : err.message,
      ...(err.details && { details: err.details }),
    },
  });
}
