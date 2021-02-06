import Base from "db-migrate-base";
import { promisify } from "util";

/**
 * Renames viewing_permissions to roles for clarity.
 * @see https://www.notion.so/RFC-Viewing-Permissions-Terminology-6275098059574423a6a18471892d2dd3
 */
export async function up(
  db: Base,
  callback: Base.CallbackFunction
): Promise<void> {
  try {
    const renameTable = promisify(db.renameTable.bind(db));
    const renameColumn = promisify(db.renameColumn.bind(db));
    const runSql = promisify(db.runSql.bind(db));

    await renameTable("viewing_permissions", "roles");
    await renameColumn("roles", "viewer_id", "user_id");
    await renameColumn("roles", "viewee_id", "related_player_id");
    await renameColumn("roles", "relationship_type", "type");
    await runSql(
      `CREATE TYPE user_role AS ENUM (
      'player',
      'mentor',
      'parent',
      'donor'
    );`,
      []
    );
    await runSql(
      "DELETE FROM roles WHERE type != 'player' AND type != 'mentor' AND type != 'parent' AND type != 'donor'",
      []
    );
    await runSql("ALTER TABLE roles ALTER COLUMN user_id SET NOT NULL", []);
    await runSql("ALTER TABLE roles ALTER COLUMN type SET NOT NULL", []);
    db.runSql(
      "ALTER TABLE roles ALTER COLUMN type TYPE user_role USING type::user_role",
      [],
      callback
    );
  } catch (err) {
    callback(err, null);
  }
}

/**
 * Reverts back to viewing_permissions table terminology.
 */
export async function down(
  db: Base,
  callback: Base.CallbackFunction
): Promise<void> {
  try {
    const renameColumn = promisify(db.renameColumn.bind(db));
    const runSql = promisify(db.runSql.bind(db));

    await runSql(
      "ALTER TABLE roles ALTER COLUMN type TYPE varchar USING type::varchar",
      []
    );
    await runSql(`DROP TYPE IF EXISTS user_role;`, []);
    await runSql("ALTER TABLE roles ALTER COLUMN type DROP NOT NULL", []);
    await runSql("ALTER TABLE roles ALTER COLUMN user_id DROP NOT NULL", []);
    await renameColumn("roles", "user_id", "viewer_id");
    await renameColumn("roles", "related_player_id", "viewee_id");
    await renameColumn("roles", "type", "relationship_type");
    db.renameTable("roles", "viewing_permissions", callback);
  } catch (err) {
    callback(err, null);
  }
}

// eslint-disable-next-line no-underscore-dangle
export const _meta = {
  version: 1,
};
