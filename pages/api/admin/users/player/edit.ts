import { PrismaClient } from "@prisma/client";

import { ValidatedNextApiRequest } from "interfaces";
import Joi from "lib/validate";
import { NextApiResponse } from "next";
import { validateBody } from "pages/api/helpers";

import sanitizeUser from "utils/sanitizeUser";
import { adminOnlyHandler } from "../../helpers";

const prisma = new PrismaClient();

export type PlayerDTO = {
  id: number;
  userId: number;
  score: string;
  comment: string;
  createdAt: Date;
};

const expectedBody = Joi.object<PlayerDTO>({
  id: Joi.number().required(),
  userId: Joi.number().required(),
  score: Joi.string(),
  comment: Joi.string(),
  createdAt: Joi.date(),
});

const handler = async (
  req: ValidatedNextApiRequest<PlayerDTO>,
  res: NextApiResponse
): Promise<void> => {
  try {
    const userInfo = req.body;
    const user = await prisma.user.update({
      where: { id: userInfo.userId || Number(req.query.userId) },
      data: {
        profileFields: {
          update: {
            where: { id: userInfo.id },
            data: {
              value: JSON.stringify({
                comment: userInfo.comment,
                value: userInfo.score,
              }),
              createdAt: userInfo.createdAt,
            },
          },
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
