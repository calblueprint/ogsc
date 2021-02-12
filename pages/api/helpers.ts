import { ValidatedNextApiHandler, ValidatedNextApiRequest } from "interfaces";
import Joi from "lib/validate";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

export const validateBody = <T>(
  handler: ValidatedNextApiHandler<T>,
  schema: Joi.ObjectSchema<T>
) => async (
  req: NextApiRequest,
  res: NextApiResponse,
  ...args: unknown[]
): Promise<void> => {
  const { error } = schema.validate(req.body || {});
  if (error) {
    res.status(400).json({ statusCode: 400, message: error.message });
    return;
  }
  handler(req as ValidatedNextApiRequest<T>, res, ...args);
};

export default {
  validateBody,
};

export type HttpMethod =
  | "GET"
  | "POST"
  | "PATCH"
  | "PUT"
  | "DELETE"
  | "OPTIONS";

export const routeByMethod = (
  httpMethodToHandlerMap: Partial<{ [method in HttpMethod]: NextApiHandler }>
) => async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const handler = httpMethodToHandlerMap[req.method as HttpMethod];
  if (!req.method || !handler) {
    res.status(404).json({ statusCode: 404, message: "API route not found" });
    return;
  }
  handler(req, res);
};
