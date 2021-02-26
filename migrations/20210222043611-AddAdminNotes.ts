import Base from "db-migrate-base";

/**
 * Creating the adminNotes column for the users table
 */
export async function up(
  db: Base,
  callback: Base.CallbackFunction
): Promise<void> {
  db.addColumn(
    "users",
    "adminNotes",
    {
      type: "string",
    },
    callback
  );
}

/**
 * deleting the adminNotes column for the users table
 */
export async function down(
  db: Base,
  callback: Base.CallbackFunction
): Promise<void> {
  db.removeColumn("users", "adminNotes", callback);
}

// eslint-disable-next-line no-underscore-dangle
export const _meta = {
  version: 1,
};
