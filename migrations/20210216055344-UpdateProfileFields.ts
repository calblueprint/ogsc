import Base from "db-migrate-base";
import updateEnumMigration from "../utils/updateEnumMigration";

/**
 * This migration updates the following profile fields:
 *
 * * Adds team name field
 * * Adds height field
 * * Adds year of birth field
 * * Removes BMI field
 * * Removes player number field
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
      "intro_video",
      "academic_engagement_score",
      "advising_score",
      "athletic_score",
      "gpa",
      "disciplinary_actions",
      "height", // Added in the up migration
      "pacer_test",
      "mile_time",
      "situps",
      "pushups",
      "health_and_wellness",
      "highlights",
      "year_of_birth", // Added in the up migration
      "team_name", // Added in the up migration
    ],
    [{ tableName: "profile_fields", columnName: "key" }],
    callback
  );
}

/**
 * This migration updates the following profile fields:
 *
 * * Removes team name field
 * * Removes height field
 * * Removes year of birth field
 * * Adds back BMI field
 * * Adds back player number field
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
      "intro_video",
      "academic_engagement_score",
      "advising_score",
      "athletic_score",
      "gpa",
      "disciplinary_actions",
      "bmi", // Removed in the up migration
      "pacer_test",
      "mile_time",
      "situps",
      "pushups",
      "health_and_wellness",
      "highlights",
      "player_number", // Removed in the up migration
    ],
    [{ tableName: "profile_fields", columnName: "key" }],
    callback
  );
}

// eslint-disable-next-line no-underscore-dangle
export const _meta = {
  version: 1,
};
