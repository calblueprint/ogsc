/* eslint-disable no-new-wrappers */
import Base from "db-migrate-base";

/**
 * Creates the user_invites table initial structure.
 */
export async function up(
  db: Base,
  callback: Base.CallbackFunction
): Promise<void> {
  db.createTable(
    "user_invites",
    {
      id: {
        type: "uuid",
        notNull: true,
        primaryKey: true,
        defaultValue: new String("uuid_generate_v4()"),
      },
      created_at: {
        type: "datetime",
        notNull: true,
        defaultValue: new String("NOW()"),
      },
      user_id: {
        type: "int",
        unsigned: true,
        notNull: true,
        foreignKey: {
          name: "fk_user_invites_user_id",
          table: "users",
          mapping: "id",
          rules: {
            onDelete: "RESTRICT",
            onUpdate: "CASCADE",
          },
        },
      },
    },
    callback
  );
}

/**
 * Drops the user_invites table.
 */
export async function down(
  db: Base,
  callback: Base.CallbackFunction
): Promise<void> {
  db.dropTable("user_invites", callback);
}

// eslint-disable-next-line no-underscore-dangle
export const _meta = {
  version: 1,
};
