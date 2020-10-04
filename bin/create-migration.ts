/* eslint-disable no-console */
import { promises as fs, existsSync } from "fs";
import path from "path";

const migrationTemplate = `import Base from "db-migrate-base";

/**
 * Describe what your \`up\` migration does.
 */
export async function up(
  db: Base,
  callback: Base.CallbackFunction
): Promise<void> {}

/**
 * Describe what your \`down\` migration does.
 */
export async function down(
  db: Base,
  callback: Base.CallbackFunction
): Promise<void> {}

// eslint-disable-next-line no-underscore-dangle
export const _meta = {
  version: 1,
};
`;

function formatDate(date: Date): string {
  return [
    date.getUTCFullYear(),
    `${date.getUTCMonth() + 1}`.padStart(2, "0"),
    `${date.getUTCDate()}`.padStart(2, "0"),
    `${date.getUTCHours()}`.padStart(2, "0"),
    `${date.getUTCMinutes()}`.padStart(2, "0"),
    `${date.getUTCSeconds()}`.padStart(2, "0"),
  ].join("");
}

const [, , migrationName] = process.argv;
if (!migrationName) {
  console.error("\n⚠️  You must specify a migration name.\n");
  process.exit(1);
}

if (!existsSync(path.resolve(process.cwd(), "migrations"))) {
  console.error(
    "\n⚠️  You must run db-migrate:create from the project root.\n"
  );
  process.exit(1);
}

const destination = path.resolve(
  process.cwd(),
  "migrations",
  `${formatDate(new Date())}-${migrationName}.ts`
);

fs.writeFile(destination, migrationTemplate).then(() => {
  console.log(`✅ Successfully created ${destination}`);
});

export {};
