import { PrismaClient } from "@prisma/client";

import { ValidatedNextApiRequest } from "interfaces";
import Joi from "lib/validate";
import { NextApiResponse } from "next";
import { validateBody } from "pages/api/helpers";

import sanitizeUser from "utils/sanitizeUser";
import { adminOnlyHandler } from "../../helpers";

const prisma = new PrismaClient();

export type DeleteFieldDTO = {
  id: number;
  userId: number;
};

const expectedBody = Joi.object<DeleteFieldDTO>({
  id: Joi.number().required(),
  userId: Joi.number().required(),
});

const handler = async (
  req: ValidatedNextApiRequest<DeleteFieldDTO>,
  res: NextApiResponse
): Promise<void> => {
  try {
    const userInfo = req.body;
    const user = await prisma.user.update({
      where: { id: userInfo.userId || Number(req.query.userId) },
      data: {
        profileFields: {
          delete: { id: userInfo.id },
        },
      },
    });
    if (!user) {
      res
        .status(404)
        .json({ statusCode: 404, message: "User does not exist." });
    }
    res.json({
      message: "Successfully updated user.",
      user: sanitizeUser(user),
    });
  } catch (err) {
    res.status(500);
    res.json({ statusCode: 500, message: err.message });
  }
};

export default validateBody(adminOnlyHandler(handler), expectedBody);
