import Base from "db-migrate-base";

export function up(db: Base, callback: Base.CallbackFunction): void {
  db.runSql(
    `CREATE TABLE players
    (
      user_id                         INTEGER NOT NULL,
      bio                             VARCHAR(255),
      academic_engagement_score       INTEGER,
      academic_engagement_comments    TEXT,
      advising_score                  INTEGER,
      advising_comments               TEXT,
      athletic_score                  INTEGER,
      athletic_comments               TEXT,
      gpa                             FLOAT,
      disciplinary_actions            TEXT,
      school_absences                 TEXT,
      advising_absences               TEXT,
      athletic_absences               TEXT,
      bmi                             FLOAT,
      health_and_wellness             TEXT,
      beep_test                       VARCHAR(255),
      mile_time                       VARCHAR(255),
      highlights                      TEXT,
      PRIMARY KEY (user_id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );`,
    callback
  );
}

export async function down(
  db: Base,
  callback: Base.CallbackFunction
): Promise<void> {
  try {
    db.dropTable("players", callback);
  } catch (err) {
    callback(err, null);
  }
}

// eslint-disable-next-line no-underscore-dangle
export const _meta = {
  version: 1,
};
