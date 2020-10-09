import Base from "db-migrate-base";

export async function up(
  db: Base,
  callback: Base.CallbackFunction
): Promise<void> {
  db.createTable(
    "viewing_permissions",
    {
      viewer_id: {
        type: "int",
        notNull: false,
        primaryKey: true,
      },
      viewee_id: "int",
      relationship_type: "string",
    },
    callback
  );
}

export async function down(
  db: Base,
  callback: Base.CallbackFunction
): Promise<void> {
  try {
    db.dropTable("viewing_permissions", callback);
  } catch (err) {
    callback(err, null);
  }
}

// eslint-disable-next-line no-underscore-dangle
export const _meta = {
  version: 1,
};
