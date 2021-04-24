import Base from "db-migrate-base";
import { promisify } from "util";

/**
 * Adds author and player ID columns
 */
export async function up(
  db: Base,
  callback: Base.CallbackFunction
): Promise<void> {
  try {
    const renameTable = promisify(db.renameTable.bind(db));
    await renameTable("Notes", "notes");
  } catch (err) {
    callback(err, null);
  }
}

/**
 * Drops author and player ID columns
 */
export async function down(
  db: Base,
  callback: Base.CallbackFunction
): Promise<void> {
  try {
    const renameTable = promisify(db.renameTable.bind(db));
    await renameTable("notes", "Notes");
  } catch (err) {
    callback(err, null);
  }
}

// eslint-disable-next-line no-underscore-dangle
export const _meta = {
  version: 1,
};
