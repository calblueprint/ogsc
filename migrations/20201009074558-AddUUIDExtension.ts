import Base from "db-migrate-base";

/**
 * Add the UUID extension to the PostgreSQL database.
 */
export async function up(
  db: Base,
  callback: Base.CallbackFunction
): Promise<void> {
  db.runSql('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";', callback);
}

/**
 * Remove the UUID extension from the PostgreSQL database.
 */
export async function down(
  db: Base,
  callback: Base.CallbackFunction
): Promise<void> {
  db.runSql('DROP EXTENSION IF EXISTS "uuid-ossp";', callback);
}

// eslint-disable-next-line no-underscore-dangle
export const _meta = {
  version: 1,
};
