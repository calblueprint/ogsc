import Base from "db-migrate-base";

/**
 * Add accepted_at column (time the invite was accepted) to user_invites.
 */
export async function up(
  db: Base,
  callback: Base.CallbackFunction
): Promise<void> {
  db.addColumn(
    "user_invites",
    "accepted_at",
    {
      type: "datetime",
    },
    callback
  );
}

/**
 * Drop accepted_at column from user_invites.
 */
export async function down(
  db: Base,
  callback: Base.CallbackFunction
): Promise<void> {
  db.removeColumn("user_invites", "accepted_at", callback);
}

// eslint-disable-next-line no-underscore-dangle
export const _meta = {
  version: 1,
};
