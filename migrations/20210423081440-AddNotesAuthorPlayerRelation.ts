import Base from "db-migrate-base";
import { promisify } from "util";

/**
 * Adds author and player ID columns
 */
export async function up(
  db: Base,
  callback: Base.CallbackFunction
): Promise<void> {
  const runSql = promisify(db.runSql.bind(db));
  const removeForeignKey = promisify<string, string>(
    db.removeForeignKey.bind(db)
  );
  const removeColumn = promisify(db.removeColumn.bind(db));
  const addColumn = promisify(db.addColumn.bind(db));

  try {
    await runSql("DELETE FROM notes WHERE true;", []);
    await removeForeignKey("notes", "fk_user_notes_user_id");
    await removeColumn("notes", "author");
    await addColumn("notes", "authorId", {
      type: "int",
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: "fk_user_notes_author_id",
        table: "users",
        mapping: "id",
        rules: {
          onDelete: "RESTRICT",
          onUpdate: "CASCADE",
        },
      },
    });
    await addColumn("notes", "playerId", {
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
    });
    callback(null, {});
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
  const runSql = promisify(db.runSql.bind(db));
  const removeForeignKey = promisify<string, string>(
    db.removeForeignKey.bind(db)
  );
  const removeColumn = promisify(db.removeColumn.bind(db));
  const addColumn = promisify(db.addColumn.bind(db));
  try {
    await runSql("DELETE FROM notes WHERE true;", []);
    await removeForeignKey("notes", "fk_user_notes_user_id");
    await removeColumn("notes", "authorId");
    await removeColumn("notes", "playerId");
    await addColumn("notes", "author", {
      type: "int",
      unsigned: true,
      foreignKey: {
        name: "fk_user_notes_user_id",
        table: "users",
        mapping: "id",
        rules: {
          onDelete: "RESTRICT",
          onUpdate: "CASCADE",
        },
      },
    });
    callback(null, {});
  } catch (err) {
    callback(err, null);
  }
}

// eslint-disable-next-line no-underscore-dangle
export const _meta = {
  version: 1,
};
