import Base from "db-migrate-base";

// creates a table for viewing permissions with two foreign keys mapping to the users table
export async function up(
  db: Base,
  callback: Base.CallbackFunction
): Promise<void> {
  db.createTable(
    "viewing_permissions",
    {
      id: {
        type: "int",
        notNull: true,
        primaryKey: true,
      },
      viewer_id: {
        type: "int",
        notNull: false,
      },
      viewee_id: "int",
      relationship_type: "string",
    },
    callback
  );
}

// drops the viewing permissions table
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
