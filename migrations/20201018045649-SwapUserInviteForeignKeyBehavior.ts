import Base from "db-migrate-base";
import { promisify } from "util";

/**
 * Set onDelete behavior to CASCADE and onUpdate behavior to RESTRICT for user_invites foreign key.
 */
export async function up(
  db: Base,
  callback: Base.CallbackFunction
): Promise<void> {
  try {
    const removeForeignKey = promisify<string, string>(
      db.removeForeignKey
    ).bind(db);
    await removeForeignKey("user_invites", "fk_user_invites_user_id");
    db.addForeignKey(
      "user_invites",
      "users",
      "fk_user_invites_user_id",
      { user_id: "id" },
      {
        onDelete: "CASCADE",
        onUpdate: "RESTRICT",
      },
      callback
    );
  } catch (err) {
    callback(err, null);
  }
}

/**
 * Revert onDelete behavior to RESTRICT and onUpdate behavior to CASCADE for user_invites foreign key.
 */
export async function down(
  db: Base,
  callback: Base.CallbackFunction
): Promise<void> {
  try {
    const removeForeignKey = promisify<string, string>(
      db.removeForeignKey
    ).bind(db);
    await removeForeignKey("user_invites", "fk_user_invites_user_id");
    db.addForeignKey(
      "user_invites",
      "users",
      "fk_user_invites_user_id",
      { user_id: "id" },
      {
        onDelete: "RESTRICT",
        onUpdate: "CASCADE",
      },
      callback
    );
  } catch (err) {
    callback(err, null);
  }
}

// eslint-disable-next-line no-underscore-dangle
export const _meta = {
  version: 1,
};
