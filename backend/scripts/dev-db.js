/**
 * Local demo database: runs an embedded MongoDB on a fixed port so the
 * backend can connect at mongodb://127.0.0.1:27017/nurixsoft without any
 * MongoDB installation. Data lives only while this process runs.
 *
 * Usage: node scripts/dev-db.js
 */
const { MongoMemoryServer } = require('mongodb-memory-server');

async function main() {
  const mongod = await MongoMemoryServer.create({
    instance: { port: 27017, ip: '127.0.0.1', dbName: 'nurixsoft' },
  });
  console.log(`[dev-db] Embedded MongoDB running at ${mongod.getUri()}`);
  console.log('[dev-db] Press Ctrl+C to stop (data is in-memory only).');

  const shutdown = async () => {
    await mongod.stop();
    process.exit(0);
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

main().catch((err) => {
  console.error('[dev-db] Failed to start embedded MongoDB:', err.message);
  process.exit(1);
});
