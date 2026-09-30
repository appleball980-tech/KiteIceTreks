import { HttpError } from '../lib/http-error.js';

// Validates req.query / req.params / req.body against a zod schema and stores
// the parsed (typed, defaulted) result on req.valid.
export const validate = (schemas) => (req, _res, next) => {
  req.valid = {};
  for (const [part, schema] of Object.entries(schemas)) {
    const result = schema.safeParse(req[part] ?? {});
    if (!result.success) {
      const details = result.error.issues.map((i) => ({ field: i.path.join('.'), message: i.message }));
      return next(new HttpError(400, 'Validation failed', details));
    }
    req.valid[part] = result.data;
  }
  next();
};
