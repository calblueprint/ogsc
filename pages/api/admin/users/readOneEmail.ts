import { PrismaClient } from "@prisma/client";
import { NextApiResponse } from "next";
import Joi from "joi";
import { ValidatedNextApiRequest } from "interfaces";
import sanitizeUser from "utils/sanitizeUser";
import { validateBody } from "pages/api/helpers";
import { adminOnlyHandler } from "../helpers";

const prisma = new PrismaClient();
export type UserDTO = {
  email: string;
};

const expectedBody = Joi.object<UserDTO>({
  email: Joi.string(),
});

const handler = async (
  req: ValidatedNextApiRequest<UserDTO>,
  res: NextApiResponse
): Promise<void> => {
  try {
    const user = await prisma.user.findOne({
      where: { email: req.body.email || String(req.query.email) },
    });
    if (!user) {
      res
        .status(404)
        .json({ statusCode: 404, message: "User does not exist." });
    } else {
      res.json({ user: sanitizeUser(user) });
    }
  } catch (err) {
    res.status(500);
    res.json({ statusCode: 500, message: err.message });
  }
};

export default validateBody(adminOnlyHandler(handler), expectedBody);
