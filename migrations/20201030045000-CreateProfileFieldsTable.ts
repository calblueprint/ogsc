/* eslint-disable camelcase */
/* eslint-disable no-new-wrappers */
import Base from "db-migrate-base";
import { promisify } from "util";

type Player = {
  user_id: number;
  bio: string | null;
  academic_engagement_score: number | null;
  academic_engagement_comments: string | null;
  advising_score: number | null;
  advising_comments: string | null;
  athletic_score: number | null;
  athletic_comments: string | null;
  gpa: number | null;
  disciplinary_actions: string | null;
  school_absences: string | null;
  advising_absences: string | null;
  athletic_absences: string | null;
  bmi: number | null;
  health_and_wellness: string | null;
  beep_test: string | null;
  mile_time: string | null;
  highlights: string | null;
};

type MigrateablePlayerKey = Exclude<
  keyof Player,
  | "user_id"
  | "academic_engagement_comments"
  | "advising_comments"
  | "athletic_comments"
  | "disciplinary_actions"
  | "school_absences"
  | "advising_absences"
  | "athletic_absences"
>;

export type ProfileField = {
  id: number;
  user_id: number;
  key:
    | "academic_engagement_score"
    | "advising_score"
    | "athletic_score"
    | "bio_about_me"
    | "bio_favorite_subject"
    | "bio_hobbies"
    | "bio_most_difficult_subject"
    | "bio_parents"
    | "bio_siblings"
    | "bmi"
    | "disciplinary_actions"
    | "gpa"
    | "health_and_wellness"
    | "highlights"
    | "mile_time"
    | "pacer_test"
    | "pushups"
    | "situps"
    | "player_number";
  value: string | null;
  created_at: Date;
};

function migrateKeyNameUp(oldKey: MigrateablePlayerKey): ProfileField["key"] {
  if (oldKey === "beep_test") {
    return "pacer_test";
  }
  if (oldKey === "bio") {
    return "bio_about_me";
  }
  return oldKey;
}

function migrateKeyNameDown(
  newKey: ProfileField["key"]
): keyof Player | undefined {
  if (newKey === "pacer_test") {
    return "beep_test";
  }
  if (newKey === "bio_about_me") {
    return "bio";
  }
  if (
    newKey === "bio_favorite_subject" ||
    newKey === "bio_hobbies" ||
    newKey === "bio_most_difficult_subject" ||
    newKey === "bio_parents" ||
    newKey === "bio_siblings" ||
    newKey === "situps" ||
    newKey === "pushups" ||
    newKey === "player_number"
  ) {
    return undefined;
  }
  return newKey;
}

/**
 * Migrate from single players table to profile_fields table.
 * @see https://www.notion.so/Refactor-Database-to-Have-New-Fields-f321ab54e8ab4e48863e56af4faeee4f
 */
export async function up(
  db: Base,
  callback: Base.CallbackFunction
): Promise<void> {
  const addIndex = promisify<string, string, string[]>(db.addIndex.bind(db));
  const all = promisify(db.all.bind(db));
  const runSql = promisify(db.runSql.bind(db));

  try {
    await runSql(
      `CREATE TYPE profile_field_key AS ENUM (
        'bio_about_me',
        'bio_hobbies',
        'bio_favorite_subject',
        'bio_most_difficult_subject',
        'bio_siblings',
        'bio_parents',
        'academic_engagement_score',
        'advising_score',
        'athletic_score',
        'gpa',
        'disciplinary_actions',
        'bmi',
        'pacer_test',
        'mile_time',
        'situps',
        'pushups',
        'health_and_wellness',
        'highlights',
        'player_number'
      );`,
      []
    );
    const createTable = promisify(db.createTable.bind(db));
    await createTable("profile_fields", {
      id: {
        type: "int",
        unsigned: true,
        notNull: true,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: "int",
        unsigned: true,
        notNull: true,
        foreignKey: {
          name: "fk_profile_fields_user_id",
          table: "users",
          rules: {
            onDelete: "CASCADE",
            onUpdate: "RESTRICT",
          },
          mapping: "id",
        },
      },
      key: {
        type: "profile_field_key",
        notNull: true,
      },
      value: {
        type: "text",
      },
      created_at: {
        type: "datetime",
        notNull: true,
        defaultValue: new String("NOW()"),
      },
    });
    await addIndex("profile_fields", "idx_profile_fields_user_id", ["user_id"]);
    await addIndex("profile_fields", "idx_profile_fields_key_created_at", [
      "key",
      "created_at",
    ]);
    await addIndex("profile_fields", "idx_profile_created_at", ["created_at"]);

    const players: Player[] = await all(`SELECT * from players;`, []);
    await Promise.all(
      players.map((player: Player) => {
        return Promise.all(
          Object.entries(player)
            .filter(
              ([key]: [string, string | number | null]) =>
                ![
                  "user_id",
                  "academic_engagement_comments",
                  "advising_comments",
                  "athletic_comments",
                  "disciplinary_actions",
                  "school_absences",
                  "advising_absences",
                  "athletic_absences",
                ].includes(key)
            )
            .map(([key, value]: [string, string | number | null]) => {
              return runSql(
                "INSERT INTO profile_fields (user_id, key, value) VALUES (?, ?, ?)",
                [
                  player.user_id,
                  migrateKeyNameUp(key as MigrateablePlayerKey),
                  value,
                ]
              );
            })
        );
      })
    );
    db.dropTable("players", callback);
  } catch (err) {
    callback(err, null);
  }
}

/**
 * Migrate from profile_fields back to single players table.
 */
export async function down(
  db: Base,
  callback: Base.CallbackFunction
): Promise<void> {
  const runSql = promisify(db.runSql.bind(db));
  const all = promisify(db.all.bind(db));
  const dropTable = promisify<string>(db.dropTable.bind(db));
  const removeIndex = promisify(db.removeIndex.bind(db));

  try {
    await runSql(
      `CREATE TABLE players
        (
          user_id integer NOT NULL,
          bio character varying(255) COLLATE pg_catalog."default",
          academic_engagement_score integer,
          academic_engagement_comments text COLLATE pg_catalog."default",
          advising_score integer,
          advising_comments text COLLATE pg_catalog."default",
          athletic_score integer,
          athletic_comments text COLLATE pg_catalog."default",
          gpa double precision,
          disciplinary_actions text COLLATE pg_catalog."default",
          school_absences text COLLATE pg_catalog."default",
          advising_absences text COLLATE pg_catalog."default",
          athletic_absences text COLLATE pg_catalog."default",
          bmi double precision,
          health_and_wellness text COLLATE pg_catalog."default",
          beep_test character varying(255) COLLATE pg_catalog."default",
          mile_time character varying(255) COLLATE pg_catalog."default",
          highlights text COLLATE pg_catalog."default",
          CONSTRAINT players_pkey PRIMARY KEY (user_id),
          CONSTRAINT players_user_id_key UNIQUE (user_id),
          CONSTRAINT players_user_id_fkey FOREIGN KEY (user_id)
              REFERENCES public.users (id) MATCH SIMPLE
              ON UPDATE NO ACTION
              ON DELETE NO ACTION
        );`,
      []
    );
    const profileFields: ProfileField[] = await all(
      `SELECT * from profile_fields;`,
      []
    );
    const fieldsByUser: { [userId: string]: Partial<Player> } = {};
    profileFields.forEach((field: ProfileField) => {
      const newKey = migrateKeyNameDown(field.key);
      if (!newKey) {
        return;
      }
      fieldsByUser[field.user_id] = {
        ...fieldsByUser[field.user_id],
        [newKey]: Number.isFinite(Number(field.value))
          ? Number(field.value)
          : field.value,
      };
    });
    await Promise.all(
      Object.entries(fieldsByUser).map(
        ([userId, player]: [string, Partial<Player>]) => {
          return runSql(
            `
            INSERT INTO players (
              user_id, bio, academic_engagement_score, advising_score, athletic_score, gpa, bmi, health_and_wellness, beep_test, mile_time, highlights
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              userId,
              player.bio,
              player.academic_engagement_score,
              player.advising_score,
              player.athletic_score,
              player.gpa,
              player.bmi,
              player.health_and_wellness,
              player.beep_test,
              player.mile_time,
              player.highlights,
            ]
          );
        }
      )
    );
    await removeIndex("profile_fields", "idx_profile_fields_user_id");
    await removeIndex("profile_fields", "idx_profile_fields_key_created_at");
    await removeIndex("profile_fields", "idx_profile_created_at");
    await dropTable("profile_fields");
    db.runSql("DROP TYPE IF EXISTS profile_field_key;", callback);
  } catch (err) {
    callback(err, null);
  }
}

// eslint-disable-next-line no-underscore-dangle
export const _meta = {
  version: 1,
};
