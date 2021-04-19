import Base from "db-migrate-base";

type TableSpec = { tableName: string; columnName: string };

/**
 * Identifies the difference between two string arrays (intended for diffing enum member types).
 */
function diffEnumMembers(
  originalValues: string[],
  newValues: string[]
): { added: string[]; removed: string[] } {
  const originalSet = new Set(originalValues);
  const newSet = new Set(newValues);

  const added = new Set(newValues);
  const removed = new Set(originalValues);

  // `added` represents the keys NOT present in the old set but present in the new set
  originalSet.forEach((key: string) => {
    added.delete(key);
  });

  // `removed` represents the keys NOT present in the new set but present in the old set
  newSet.forEach((key: string) => {
    removed.delete(key);
  });

  return {
    added: Array.from(added),
    removed: Array.from(removed),
  };
}

/**
 * Utility for migrating an enum migration. Note that `enumValues` will replace all existing values
 * of the current enum state.
 */
export default function updateEnumMigration(
  db: Base,
  enumName: string,
  enumValues: string[],
  affectedTables: TableSpec[],
  callback: Base.CallbackFunction
): void {
  db.all(
    `SELECT enum_range(NULL::"${enumName}");`,
    (
      err: Error | undefined,
      // eslint-disable-next-line camelcase
      [response]: [{ enum_range: string }]
    ): void => {
      if (err) {
        callback(err, null);
        return;
      }
      const currentEnumMembers = response.enum_range
        .slice(1, response.enum_range.length - 1)
        .split(",");
      const { removed } = diffEnumMembers(currentEnumMembers, enumValues);

      db.runSql(
        `
      ALTER TYPE "${enumName}" RENAME TO "${enumName}_migrating";
      CREATE TYPE "${enumName}" AS ENUM (${enumValues
          .map((value: string) => `'${value}'`)
          .join(", ")});
  
      ${affectedTables
        .map(
          (table: TableSpec) =>
            `${removed
              .map(
                (removedMember: string) =>
                  `DELETE FROM "${table.tableName}" WHERE "${table.columnName}" = '${removedMember}';`
              )
              .join("\n")}
            ALTER TABLE "${table.tableName}" ALTER COLUMN "${
              table.columnName
            }" TYPE "${enumName}" USING "${
              table.columnName
            }"::"text"::"${enumName}";`
        )
        .join("\n")}
  
      DROP TYPE "${enumName}_migrating";
    `,
        [],
        callback
      );
    }
  );
}
