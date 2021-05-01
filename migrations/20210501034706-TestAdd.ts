import Base from "db-migrate-base";
import { updateEnumMigrationWithDiff } from "utils/updateEnumMigration";

/**
 * Describe what your `up` migration does.
 */
export async function up(
  db: Base,
  callback: Base.CallbackFunction
): Promise<void> {
  updateEnumMigrationWithDiff(
    db,
    "profile_field_key",
    { add: ["Test"], remove: [] },
    [{ columnName: "key", tableName: "profile_fields" }],
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
  updateEnumMigrationWithDiff(
    db,
    "profile_field_key",
    { remove: ["Test"], add: [] },
    [{ columnName: "key", tableName: "profile_fields" }],
    callback
  );
}

// eslint-disable-next-line no-underscore-dangle
export const _meta = {
  version: 1,
};
