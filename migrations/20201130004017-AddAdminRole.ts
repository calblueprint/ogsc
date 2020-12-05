import Base from "db-migrate-base";
import { promisify } from "util";
import updateEnumMigration from "../utils/updateEnumMigration";

type User = {
  id: number;
};

/**
 * Drop is_admin column from users table and replace with admin-type Roles.
 */
export async function up(
  db: Base,
  callback: Base.CallbackFunction
): Promise<void> {
  try {
    const all = promisify(db.all.bind(db));
    const runSql = promisify(db.runSql.bind(db));
    const updateEnum = promisify(updateEnumMigration);
    await updateEnum(
      db,
      "user_role",
      ["admin", "player", "mentor", "parent", "donor"],
      [{ tableName: "roles", columnName: "type" }]
    );
    const admins: User[] = await all(
      `SELECT * from users WHERE is_admin = true;`,
      []
    );
    await Promise.all(
      admins.map((admin: User) =>
        runSql("INSERT INTO roles (type, user_id) VALUES ('admin', ?);", [
          admin.id,
        ])
      )
    );
    db.removeColumn("users", "is_admin", callback);
  } catch (err) {
    callback(err, null);
  }
}

/**
 * Re-add is_admin column to users table.
 */
export async function down(
  db: Base,
  callback: Base.CallbackFunction
): Promise<void> {
  try {
    const addColumn = promisify(db.addColumn.bind(db));
    const runSql = promisify(db.runSql.bind(db));
    const updateEnum = promisify(updateEnumMigration);

    await addColumn("users", "is_admin", {
      type: "boolean",
      defaultValue: false,
      notNull: true,
    });
    await runSql("DELETE FROM roles WHERE type = 'admin'", []);
    await updateEnum(
      db,
      "user_role",
      ["player", "mentor", "parent", "donor"],
      [{ tableName: "roles", columnName: "type" }]
    );
  } catch (err) {
    callback(err, null);
  }
}

// eslint-disable-next-line no-underscore-dangle
export const _meta = {
  version: 1,
};
