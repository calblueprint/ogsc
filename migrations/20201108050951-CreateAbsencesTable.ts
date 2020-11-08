import Base from "db-migrate-base";
import { promisify } from "util";

/**
 * Create a table for tracking player absences.
 */
export async function up(
  db: Base,
  callback: Base.CallbackFunction
): Promise<void> {
  const runSql = promisify(db.runSql.bind(db));
  const createTable = promisify(db.createTable.bind(db));

  try {
    await runSql(
      `CREATE TYPE absence_reason AS ENUM (
        'excused',
        'unexcused'
      );`,
      []
    );
    await createTable("absences", {
      id: {
        type: "int",
        primaryKey: true,
        autoIncrement: true,
        notNull: true,
        unsigned: true,
      },
      user_id: {
        type: "int",
        unsigned: true,
        notNull: true,
        foreignKey: {
          name: "fk_absences_user_id",
          table: "users",
          rules: {
            onDelete: "CASCADE",
            onUpdate: "RESTRICT",
          },
          mapping: "id",
        },
      },
      date: {
        type: "datetime",
        notNull: true,
      },
      description: {
        type: "text",
        defaultValue: "",
        notNull: true,
      },
      reason: {
        type: "absence_reason",
        notNull: true,
      },
    });
    db.addIndex("absences", "idx_absences_user_id", ["user_id"], callback);
  } catch (err) {
    callback(err, null);
  }
}

/**
 * Drop the absences able.
 */
export async function down(
  db: Base,
  callback: Base.CallbackFunction
): Promise<void> {
  const removeIndex = promisify(db.removeIndex.bind(db));
  const dropTable = promisify<string>(db.dropTable.bind(db));
  try {
    await removeIndex("absences", "idx_absences_user_id");
    await dropTable("absences");
    db.runSql("DROP TYPE IF EXISTS absence_reason", callback);
  } catch (err) {
    callback(err, null);
  }
}

// eslint-disable-next-line no-underscore-dangle
export const _meta = {
  version: 1,
};
