import Base from "db-migrate-base";

type TableSpec = { tableName: string; columnName: string };

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
  db.runSql(
    `
    ALTER TYPE "${enumName}" RENAME TO "${enumName}_migrating";
    CREATE TYPE "${enumName}" AS ENUM (${enumValues
      .map((value: string) => `'${value}'`)
      .join(", ")});

    ${affectedTables
      .map(
        (table: TableSpec) =>
          `ALTER TABLE "${table.tableName}" ALTER COLUMN "${table.columnName}" TYPE "${enumName}" USING "${table.columnName}"::"text"::"${enumName}";`
      )
      .join("\n")}

    DROP TYPE "${enumName}_migrating";
  `,
    [],
    callback
  );
}
