import Base from "db-migrate-base";
import { promisify } from "util";

/**
 * Add status field to user table.
 */
export async function up(
  db: Base,
  callback: Base.CallbackFunction
): Promise<void> {
  const runSql = promisify(db.runSql.bind(db));

  try {
    await runSql(
      `CREATE TYPE user_status AS ENUM (
        'active',
        'inactive',
        'pending_admin_approval',
        'pending_user_acceptance'
      );`,
      []
    );
    db.addColumn(
      "users",
      "status",
      {
        type: "user_status",
        defaultValue: "active",
        notNull: true,
      },
      callback
    );
    await runSql(`ALTER TABLE users ALTER COLUMN status DROP DEFAULT;`, []);
  } catch (err) {
    callback(err, null);
  }
}

/**
 * Remove status field from user table.
 */
export async function down(
  db: Base,
  callback: Base.CallbackFunction
): Promise<void> {
  const runSql = promisify(db.runSql.bind(db));

  try {
    db.removeColumn("users", "status", callback);
    await runSql("DROP TYPE IF EXISTS user_status", []);
  } catch (err) {
    callback(err, null);
  }
}

// eslint-disable-next-line no-underscore-dangle
export const _meta = {
  version: 1,
};
