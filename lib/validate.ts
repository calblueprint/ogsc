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

export default Joi.extend(JoiPhoneNumber as ExtensionFactory) as typeof Joi;
