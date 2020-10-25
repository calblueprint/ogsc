import Base from "db-migrate-base";

/**
 * Add autoincrement sequence behavior to the IDs of the viewing_permissions table.
 */
export async function up(
  db: Base,
  callback: Base.CallbackFunction
): Promise<void> {
  db.runSql(
    `
  CREATE SEQUENCE viewing_permissions_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1;
    
  ALTER TABLE viewing_permissions ALTER id SET DEFAULT nextval('viewing_permissions_id_seq'::regclass);
    `,
    callback
  );
}

/**
 * Remove autoincrement sequence behavior to the IDs of the viewing_permissions table.
 *
 * **Note**: This is not a safe down migration as the ID sequence will be destroyed and recreated
 * with a start value of 1.
 */
export async function down(
  db: Base,
  callback: Base.CallbackFunction
): Promise<void> {
  db.runSql(
    `
  DROP SEQUENCE viewing_permissions_id_seq;
  ALTER TABLE viewing_permissions ALTER id DROP DEFAULT;
    `,
    callback
  );
}

// eslint-disable-next-line no-underscore-dangle
export const _meta = {
  version: 1,
};
