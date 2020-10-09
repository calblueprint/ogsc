import Base from "db-migrate-base";

/**
 * Adds the hashed_password field to the users table.
 */
export async function up(
  db: Base,
  callback: Base.CallbackFunction
): Promise<void> {
  db.addColumn(
    "users",
    "hashed_password",
    {
      type: "string",
      notNull: true,
    },
    callback
  );
}

/**
 * Removes the hashed_password field to the users table.
 */
export async function down(
  db: Base,
  callback: Base.CallbackFunction
): Promise<void> {
  db.removeColumn("users", "hashed_password", callback);
}

// eslint-disable-next-line no-underscore-dangle
export const _meta = {
  version: 1,
};
