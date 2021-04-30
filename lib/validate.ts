import { ProfileFieldValue } from "interfaces";
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
export const ProfileFieldValueValidators: Record<
  ProfileFieldValue,
  Joi.Schema
> = {
  [ProfileFieldValue.Text]: Joi.string().required(),
  [ProfileFieldValue.URL]: Joi.string().uri().required(),
  [ProfileFieldValue.Integer]: Joi.number().integer().required(),
  [ProfileFieldValue.IntegerWithComment]: CouldBeJSON.object({
    comment: Joi.string(),
    value: Joi.number().integer().required(),
    date: Joi.string().isoDate().required(),
  }).required(),
  [ProfileFieldValue.Float]: Joi.number().required(),
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
};

export default Joi.extend(JoiPhoneNumber as ExtensionFactory) as typeof Joi;
