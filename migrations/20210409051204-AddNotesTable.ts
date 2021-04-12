import Base from "db-migrate-base";
import { promisify } from "util";

export async function up(
  db: Base,
  callback: Base.CallbackFunction
): Promise<void> {
  const runSql = promisify(db.runSql.bind(db));
  const createTable = promisify(db.createTable.bind(db));
  try {
    await runSql(
      `CREATE TYPE note_type AS ENUM (
        'general',
        'soccer',
        'academics',
        'mentorship'
      );`,
      []
    );
    await createTable("Notes", {
      id: {
        type: "int",
        primaryKey: true,
        autoIncrement: true,
        notNull: true,
        unsigned: true,
      },
      author: {
        type: "int",
        unsigned: true,
        notNull: true,
        foreignKey: {
          name: "fk_user_notes_user_id",
          table: "users",
          mapping: "id",
          rules: {
            onDelete: "RESTRICT",
            onUpdate: "CASCADE",
          },
        },
      },
      created_at: {
        type: "datetime",
        notNull: true,
        // eslint-disable-next-line no-new-wrappers
        defaultValue: new String("NOW()"),
      },
      content: {
        type: "string",
        notNull: true,
      },
      type: {
        type: "note_type",
        defaultValue: "general",
        notNull: true,
      },
    });
  } catch (err) {
    callback(err, null);
  }
}

/**
 * Drops the notes table.
 */
export async function down(
  db: Base,
  callback: Base.CallbackFunction
): Promise<void> {
  const runSql = promisify(db.runSql.bind(db));
  try {
    db.dropTable("Notes", callback);
    await runSql("DROP TYPE IF EXISTS note_type", []);
  } catch (err) {
    callback(err, null);
  }
}

// eslint-disable-next-line no-underscore-dangle
export const _meta = {
  version: 1,
};
