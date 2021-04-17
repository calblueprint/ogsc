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
  [ProfileFieldValue.IntegerWithComment]: Joi.object({
    comment: Joi.string(),
    value: Joi.number().integer().required(),
  }).required(),
  [ProfileFieldValue.Float]: Joi.number().required(),
  [ProfileFieldValue.FloatWithComment]: Joi.object({
    comment: Joi.string(),
    value: Joi.number().required(),
  }).required(),
  [ProfileFieldValue.TimeElapsed]: Joi.string().isoDuration().required(),
  [ProfileFieldValue.DistanceMeasured]: Joi.number().required(),
};

export default Joi.extend(JoiPhoneNumber as ExtensionFactory) as typeof Joi;
