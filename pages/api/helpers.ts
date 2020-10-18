import { ValidatedNextApiHandler, ValidatedNextApiRequest } from "interfaces";
import Joi from "joi";
import { NextApiRequest, NextApiResponse } from "next";

export const validateBody = <T>(
  handler: ValidatedNextApiHandler<T>,
  schema: Joi.ObjectSchema<T>
) => async (
  req: NextApiRequest,
  res: NextApiResponse,
  ...args: unknown[]
): Promise<void> => {
  const { error } = schema.validate(req.body);
  if (error) {
    res.status(400).json({ statusCode: 400, message: error.message });
    return;
  }
  handler(req as ValidatedNextApiRequest<T>, res, ...args);
};

export default {
  validateBody,
};
