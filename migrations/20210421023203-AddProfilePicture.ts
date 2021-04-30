import Base from "db-migrate-base";
import updateEnumMigration from "../utils/updateEnumMigration";

/**
 * Adds profile_picture to the profile field key.
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
      "internal_assessments",
      "standardized_testing",
      "gpa",
      "disciplinary_actions",
      "height",
      "pacer_test",
      "mile_time",
      "situps",
      "pushups",
      "health_and_wellness",
      "highlights",
      "year_of_birth",
      "profile_picture", // Added in this migration
    ],
    [{ tableName: "profile_fields", columnName: "key" }],
    callback
  );
}

/**
 * Removes profile_picture field
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
      "internal_assessments",
      "standardized_testing",
      "gpa",
      "disciplinary_actions",
      "height",
      "pacer_test",
      "mile_time",
      "situps",
      "pushups",
      "health_and_wellness",
      "highlights",
      "year_of_birth",
    ],
    [{ tableName: "profile_fields", columnName: "key" }],
    callback
  );
}

// eslint-disable-next-line no-underscore-dangle
export const _meta = {
  version: 1,
};
