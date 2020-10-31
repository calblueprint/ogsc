import Base from "db-migrate-base";

/**
 * Add phone number column to users.
 */
export async function up(
  db: Base,
  callback: Base.CallbackFunction
): Promise<void> {
  db.addColumn(
    "users",
    "phone_number",
    {
      type: "string",
    },
    callback
  );
}

/**
 * Drop phone number column from users.
 */
export async function down(
  db: Base,
  callback: Base.CallbackFunction
): Promise<void> {
  db.removeColumn("users", "phone_number", callback);
}

// eslint-disable-next-line no-underscore-dangle
export const _meta = {
  version: 1,
};
