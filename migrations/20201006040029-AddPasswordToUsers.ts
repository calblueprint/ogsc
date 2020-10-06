import Base from "db-migrate-base";

/**
 * Describe what your `up` migration does.
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
 * Describe what your `down` migration does.
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
