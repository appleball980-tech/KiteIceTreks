// Creates (or resets the password of) a dashboard user.
//   npm run admin:create -- --email you@example.com --name "Your Name" [--role admin|editor]
// The password is asked for interactively (hidden), or read from ADMIN_PASSWORD.

import { parseArgs } from 'node:util';
import { createInterface } from 'node:readline';
import { prisma } from '../src/lib/prisma.js';
import { hashPassword } from '../src/lib/password.js';

const { values } = parseArgs({
  options: { email: { type: 'string' }, name: { type: 'string' }, role: { type: 'string', default: 'admin' } },
});

const email = (values.email ?? process.env.ADMIN_EMAIL)?.trim().toLowerCase();
const name = values.name ?? process.env.ADMIN_NAME ?? 'Administrator';
const role = values.role;

function askHidden(question) {
  return new Promise((resolve) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    rl._writeToOutput = (s) => rl.output.write(s.startsWith(question) ? s : '');
    rl.question(question, (answer) => {
      rl.close();
      process.stdout.write('\n');
      resolve(answer);
    });
  });
}

try {
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) throw new Error('Pass a valid --email (or set ADMIN_EMAIL)');
  if (!['admin', 'editor'].includes(role)) throw new Error('--role must be admin or editor');

  const password = process.env.ADMIN_PASSWORD || (await askHidden('Password (min 10 characters): '));
  if (password.length < 10) throw new Error('Password must be at least 10 characters');

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.upsert({
    where: { email },
    create: { email, name, role, passwordHash },
    // Resetting logs the user out of existing sessions
    update: { passwordHash, role, isActive: true, tokenVersion: { increment: 1 } },
  });
  console.log(`✔ ${user.role} ${user.email} is ready. Log in with POST /api/v1/auth/login`);
} catch (err) {
  console.error(`✖ ${err.message}`);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
