import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../../middleware/validate.js';
import { SETTINGS_KEYS, getSettings, settingsSchemas, updateSetting } from '../../services/settings.service.js';
import { HttpError } from '../../lib/http-error.js';

export const adminSettingsRouter = Router()
  .get('/', async (_req, res) => {
    res.json({ data: await getSettings() });
  })
  // PUT /admin/settings/contact  { phone, whatsapp, email, hours, address: {...} }
  .put('/:key', validate({ params: z.object({ key: z.enum(SETTINGS_KEYS) }) }), async (req, res) => {
    const { key } = req.valid.params;
    const result = settingsSchemas[key].safeParse(req.body);
    if (!result.success) {
      throw new HttpError(400, 'Validation failed', result.error.issues.map((i) => ({ field: i.path.join('.'), message: i.message })));
    }
    res.json({ data: await updateSetting(key, result.data) });
  });
