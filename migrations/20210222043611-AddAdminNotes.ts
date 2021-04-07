import Base from "db-migrate-base";

/**
 * Creating the adminNote column for the users table
 */
export async function up(
  db: Base,
  callback: Base.CallbackFunction
): Promise<void> {
  db.addColumn(
    "users",
    "adminNote",
    {
      type: "string",
    },
    callback
  );
}

/**
 * deleting the adminNote column for the users table
 */
export async function down(
  db: Base,
  callback: Base.CallbackFunction
): Promise<void> {
  db.removeColumn("users", "adminNote", callback);
}

// eslint-disable-next-line no-underscore-dangle
export const _meta = {
  version: 1,
};
