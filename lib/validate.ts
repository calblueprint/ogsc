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

export const ProfileFieldValueValidators: Record<
  ProfileFieldValue,
  Joi.Schema
> = {
  [ProfileFieldValue.Text]: Joi.string(),
  [ProfileFieldValue.URL]: Joi.string().uri(),
  [ProfileFieldValue.Integer]: Joi.number().integer(),
  [ProfileFieldValue.IntegerWithComment]: Joi.object({
    comment: Joi.string(),
    value: Joi.number().integer().required(),
  }),
  [ProfileFieldValue.Float]: Joi.number(),
  [ProfileFieldValue.FloatWithComment]: Joi.object({
    comment: Joi.string(),
    value: Joi.number().required(),
  }),
  [ProfileFieldValue.TimeElapsed]: Joi.string().isoDuration(),
  [ProfileFieldValue.DistanceMeasured]: Joi.number(),
};

export default Joi.extend(JoiPhoneNumber as ExtensionFactory) as typeof Joi;
