import Base from "db-migrate-base";

/**
 * Add is_admin boolean column to the users table.
 */
export async function up(
  db: Base,
  callback: Base.CallbackFunction
): Promise<void> {
  db.addColumn(
    "users",
    "is_admin",
    {
      type: "boolean",
      defaultValue: false,
      notNull: true,
    },
    callback
  );
}

/**
 * Remove is_admin boolean column from the users table.
 */
export async function down(
  db: Base,
  callback: Base.CallbackFunction
): Promise<void> {
  db.removeColumn("users", "is_admin", callback);
}

// eslint-disable-next-line no-underscore-dangle
export const _meta = {
  version: 1,
};
