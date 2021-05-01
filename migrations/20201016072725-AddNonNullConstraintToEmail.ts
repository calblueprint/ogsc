import Base from "db-migrate-base";

/**
 * Add non-null constraint to email property on users table.
 */
export async function up(
  db: Base,
  callback: Base.CallbackFunction
): Promise<void> {
  db.changeColumn(
    "users",
    "email",
    {
      type: "string",
      notNull: true,
    },
    callback
  );
}

/**
 * Remove non-null constraint to email property on users table.
 */
export async function down(
  db: Base,
  callback: Base.CallbackFunction
): Promise<void> {
  db.changeColumn(
    "users",
    "email",
    {
      type: "string",
      notNull: false,
    },
    callback
  );
}

// eslint-disable-next-line no-underscore-dangle
export const _meta = {
  version: 1,
};
