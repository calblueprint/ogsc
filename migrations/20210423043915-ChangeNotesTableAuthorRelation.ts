import Base from "db-migrate-base";

/**
 * Adds author and player ID columns
 */
export async function up(
  db: Base,
  callback: Base.CallbackFunction
): Promise<void> {
  try {
    db.removeColumn("notes", "author", callback);
    db.addColumn(
      "notes",
      "authorId",
      {
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
      },
      callback
    );
    db.addColumn(
      "notes",
      "userId",
      {
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
      callback
    );
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
    db.addColumn(
      "notes",
      "author",
      {
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
      callback
    );
    db.removeColumn("notes", "userId", callback);
    db.removeColumn("notes", "authorId", callback);
  } catch (err) {
    callback(err, null);
  }
}

// eslint-disable-next-line no-underscore-dangle
export const _meta = {
  version: 1,
};
