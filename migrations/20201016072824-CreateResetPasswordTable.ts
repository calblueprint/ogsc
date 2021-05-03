/* eslint-disable no-new-wrappers */
import Base from "db-migrate-base";

/**
 * Creates the reset_password table.
 */
export async function up(
  db: Base,
  callback: Base.CallbackFunction
): Promise<void> {
  db.createTable(
    "reset_password",
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
          name: "fk_reset_password_user_id",
          table: "users",
          mapping: "id",
          rules: {
            onDelete: "RESTRICT",
            onUpdate: "CASCADE",
          },
        },
      },
      is_used: {
        type: "boolean",
        notNull: true,
        defaultValue: new Boolean(false),
      },
    },
    callback
  );
}

/**
 * Drops the reset_password table.
 */
export async function down(
  db: Base,
  callback: Base.CallbackFunction
): Promise<void> {
  db.dropTable("reset_password", callback);
}

// eslint-disable-next-line no-underscore-dangle
export const _meta = {
  version: 1,
};
