import Base from "db-migrate-base";
import { promisify } from "util";

export async function up(
  db: Base,
  callback: Base.CallbackFunction
): Promise<void> {
  try {
    const addForeignKey = promisify(db.addForeignKey.bind(db));
    await addForeignKey(
      "viewing_permissions",
      "users",
      "viewer_id",
      { viewer_id: "id" },
      {
        onDelete: "CASCADE",
        onUpdate: "RESTRICT",
      }
    );

    db.addForeignKey(
      "viewing_permissions",
      "users",
      "viewee_id",
      { viewee_id: "id" },
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

export async function down(
  db: Base,
  callback: Base.CallbackFunction
): Promise<void> {
  try {
    const removeForeignKey = promisify<string, string>(
      db.removeForeignKey.bind(db)
    );
    await removeForeignKey("viewing_permissions", "viewee_id");
    db.removeForeignKey("viewing_permissions", "viewer_id", callback);
  } catch (err) {
    callback(err, null);
  }
}

// eslint-disable-next-line no-underscore-dangle
export const _meta = {
  version: 1,
};
