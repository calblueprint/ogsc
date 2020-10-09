import Base from "db-migrate-base";

/**
 * Add the UNIQUE constraint to the user_id column of players.
 */
export async function up(
  db: Base,
  callback: Base.CallbackFunction
): Promise<void> {
  db.changeColumn(
    "players",
    "user_id",
    {
      type: "int",
      notNull: true,
      unique: true,
      foreignKey: {
        name: "fk_players_user_id",
        table: "users",
        rules: {
          onDelete: "CASCADE",
          onUpdate: "RESTRICT",
        },
        mapping: "id",
      },
    },
    callback
  );
}

/**
 * Remove the UNIQUE constraint from the user_id column of players.
 */
export async function down(
  db: Base,
  callback: Base.CallbackFunction
): Promise<void> {
  db.changeColumn(
    "players",
    "user_id",
    {
      type: "int",
      notNull: true,
      unique: false,
      foreignKey: {
        name: "fk_players_user_id",
        table: "users",
        rules: {
          onDelete: "CASCADE",
          onUpdate: "RESTRICT",
        },
        mapping: "id",
      },
    },
    callback
  );
}

// eslint-disable-next-line no-underscore-dangle
export const _meta = {
  version: 1,
};
