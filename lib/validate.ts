import { ProfileFieldKey } from "@prisma/client";
import { ProfileFieldValue, ProfileFieldValues } from "interfaces";
import Joi, { ExtensionFactory } from "joi";
import JoiPhoneNumber from "joi-phone-number";

declare module "joi" {
  interface PhoneNumberOptions {
    defaultCountry?: string[] | string;
    strict?: boolean;
    format?: "e164" | "international" | "national" | "rfc3966";
  }

  interface StringSchema extends AnySchema {
    phoneNumber(options?: PhoneNumberOptions): this;
  }
}

const CouldBeJSON = Joi.extend(
  (joi): Joi.Extension => {
    return {
      type: "object",
      base: joi.object(),
      coerce: (value): Joi.CoerceResult => {
        if (value[0] !== "{" && !/^\s*\{/.test(value)) {
          return {};
        }
        try {
          return { value: JSON.parse(value) };
        } catch (err) {
          return { errors: [err] };
        }
      },
    };
  }
) as typeof Joi;

/**
 * Contains a map of ProfileFieldValues to runtime validators for _serialized_ values.
 */
export const ProfileFieldValueValidators = {
  [ProfileFieldValue.Text]: Joi.string().required(),
  [ProfileFieldValue.URL]: Joi.string().uri().required(),
  [ProfileFieldValue.Integer]: Joi.number().integer().positive().required(),
  [ProfileFieldValue.IntegerWithComment]: CouldBeJSON.object({
    comment: Joi.string(),
    value: Joi.number().integer().required(),
    date: Joi.string().isoDate().required(),
  }).required(),
  [ProfileFieldValue.Float]: Joi.number().positive().required(),
  [ProfileFieldValue.FloatWithComment]: CouldBeJSON.object({
    comment: Joi.string(),
    value: Joi.number().required(),
    date: Joi.string().isoDate().required(),
  }).required(),
  [ProfileFieldValue.TimeElapsed]: Joi.string().isoDuration().required(),
  [ProfileFieldValue.DistanceMeasured]: Joi.number().required(),
  [ProfileFieldValue.File]: CouldBeJSON.object({
    key: Joi.string().required(),
  }).required(),
  [ProfileFieldValue.StandardizedTestResult]: CouldBeJSON.object({
    comment: Joi.string(),
    value: Joi.number().integer().required(),
    percentile: Joi.number().integer().min(0).max(99).required(),
    date: Joi.string().isoDate().required(),
  }),
  [ProfileFieldValue.TextListItem]: CouldBeJSON.object({
    comment: Joi.string().required(),
    date: Joi.string().isoDate().required(),
  }),
} as const;

/**
 * Check that all types of ProfileFieldValues are accounted for in the above Validators map.
 * If there is a type error here, you likely need to add a Joi validator for the missing
 * ProfileFieldValue reported here.
 */
const ProfileFieldValueValidatorsTypeCheck: Record<
  ProfileFieldValue,
  Joi.Schema
> = ProfileFieldValueValidators;
// eslint-disable-next-line no-unused-expressions
ProfileFieldValueValidatorsTypeCheck;

const EngagementScoreValidator = CouldBeJSON.object({
  value: Joi.number().min(0).max(10).required().label("Engagement Score"),
}).unknown(true);

/**
 * In addition to the validators applied as a part of being a specific ProfileFieldValue,
 * more strict validations can be applied on a per-FieldKey basis here.
 *
 * The validator here _must match_ the type of schema defined in the validator for its
 * FieldValue type.
 */
export const ProfileFieldExtraValidators: Partial<
  {
    [K in ProfileFieldKey]: typeof ProfileFieldValueValidators[ProfileFieldValues[K]];
  }
> = {
  [ProfileFieldKey.AcademicEngagementScore]: EngagementScoreValidator,
  [ProfileFieldKey.AdvisingScore]: EngagementScoreValidator,
  [ProfileFieldKey.AthleticScore]: EngagementScoreValidator,
  [ProfileFieldKey.GPA]: CouldBeJSON.object({
    value: Joi.number().min(0).max(5).required().label("GPA"),
  }).unknown(true),
  [ProfileFieldKey.YearOfBirth]: Joi.number()
    .min(1900)
    .max(new Date().getFullYear())
    .messages({
      "number.min": "Birth Year must be a valid year",
      "number.max": "Birth Year must be a valid year",
    })
    .required(),
};

export default Joi.extend(JoiPhoneNumber as ExtensionFactory) as typeof Joi;
