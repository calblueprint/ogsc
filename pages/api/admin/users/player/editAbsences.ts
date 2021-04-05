import { Absence } from "@prisma/client";
import prisma from "utils/prisma";

import { ValidatedNextApiRequest } from "interfaces";
import Joi from "lib/validate";
import { NextApiResponse } from "next";
import { validateBody } from "pages/api/helpers";

import sanitizeUser from "utils/sanitizeUser";
import { adminOnlyHandler } from "../../helpers";

const expectedBody = Joi.object<Absence>({
  id: Joi.number().required(),
  userId: Joi.number().required(),
  description: Joi.string(),
  reason: Joi.string().required(),
  date: Joi.date(),
});

const handler = async (
  req: ValidatedNextApiRequest<Absence>,
  res: NextApiResponse
): Promise<void> => {
  try {
    const userInfo = req.body;
    const user = await prisma.user.update({
      where: { id: userInfo.userId || Number(req.query.userId) },
      data: {
        absences: {
          update: {
            where: { id: userInfo.id },
            data: {
              reason: userInfo.reason,
              description: userInfo.description,
              date: userInfo.date,
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
