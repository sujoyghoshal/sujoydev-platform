import { connectDatabase, disconnectDatabase } from '../config/database';
import { env } from '../config/env';
import { Admin } from '../models/Admin';
import { logger } from '../utils/logger';

/**
 * Idempotent first-run seed: creates the bootstrap superadmin from
 * ADMIN_EMAIL / ADMIN_PASSWORD env vars if no admin exists yet.
 */
async function seed(): Promise<void> {
  await connectDatabase();

  const existing = await Admin.countDocuments();
  if (existing > 0) {
    logger.info(`Seed skipped — ${existing} admin account(s) already exist`);
    return;
  }

  if (!env.adminBootstrap.password || env.adminBootstrap.password.length < 8) {
    throw new Error('Set ADMIN_PASSWORD (min 8 chars) in .env before seeding');
  }

  const admin = await Admin.create({
    name: 'Sujoy Ghoshal',
    email: env.adminBootstrap.email,
    password: env.adminBootstrap.password,
    role: 'superadmin',
  });
  logger.info(`Superadmin created: ${admin.email}`);
}

seed()
  .catch((error) => {
    logger.error('Seed failed', { error: error.message });
    process.exitCode = 1;
  })
  .finally(() => void disconnectDatabase());
