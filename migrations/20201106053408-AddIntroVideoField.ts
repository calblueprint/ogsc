import Base from "db-migrate-base";
import updateEnumMigration from "../utils/updateEnumMigration";

/**
 * Add the "intro_video" member to the profile_field_key enum.
 */
export async function up(
  db: Base,
  callback: Base.CallbackFunction
): Promise<void> {
  updateEnumMigration(
    db,
    "profile_field_key",
    [
      "bio_about_me",
      "bio_hobbies",
      "bio_favorite_subject",
      "bio_most_difficult_subject",
      "bio_siblings",
      "bio_parents",
      "intro_video", // Added in this up migration
      "academic_engagement_score",
      "advising_score",
      "athletic_score",
      "gpa",
      "disciplinary_actions",
      "bmi",
      "pacer_test",
      "mile_time",
      "situps",
      "pushups",
      "health_and_wellness",
      "highlights",
      "player_number",
    ],
    [{ tableName: "profile_fields", columnName: "key" }],
    callback
  );
}

/**
 * Remove the "intro_video" member from the profile_field_key enum.
 */
export async function down(
  db: Base,
  callback: Base.CallbackFunction
): Promise<void> {
  updateEnumMigration(
    db,
    "profile_field_key",
    [
      "bio_about_me",
      "bio_hobbies",
      "bio_favorite_subject",
      "bio_most_difficult_subject",
      "bio_siblings",
      "bio_parents",
      "academic_engagement_score",
      "advising_score",
      "athletic_score",
      "gpa",
      "disciplinary_actions",
      "bmi",
      "pacer_test",
      "mile_time",
      "situps",
      "pushups",
      "health_and_wellness",
      "highlights",
      "player_number",
    ],
    [{ tableName: "profile_fields", columnName: "key" }],
    callback
  );
}

// eslint-disable-next-line no-underscore-dangle
export const _meta = {
  version: 1,
};
