import { mkdir, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { env } from '../config/env.js';

// Local-disk storage for uploaded images, served by Express at /uploads.
// To move to S3 / Cloudflare R2 later, re-implement save() and remove() with the
// same signatures and keep returning public paths or URLs.
export const uploadRoot = path.resolve(env.UPLOAD_DIR);
export const PUBLIC_PREFIX = '/uploads';

// Saves a file under uploads/<key> and returns its public path (/uploads/<key>)
export async function save(key, buffer) {
  const file = path.join(uploadRoot, key);
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, buffer, { flag: 'wx' }); // never overwrite
  return `${PUBLIC_PREFIX}/${key}`;
}

export async function remove(publicPath) {
  if (!publicPath.startsWith(`${PUBLIC_PREFIX}/`)) return;
  const file = path.join(uploadRoot, publicPath.slice(PUBLIC_PREFIX.length + 1));
  if (!file.startsWith(uploadRoot + path.sep)) return; // path traversal guard
  await unlink(file).catch((err) => {
    if (err.code !== 'ENOENT') throw err;
  });
}
