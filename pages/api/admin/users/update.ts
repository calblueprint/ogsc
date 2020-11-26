import { PrismaClient } from "@prisma/client";
import { ValidatedNextApiRequest } from "interfaces";
import Joi from "joi";
import { NextApiResponse } from "next";
import { validateBody } from "pages/api/helpers";

import sanitizeUser from "utils/sanitizeUser";
import { adminOnlyHandler } from "../helpers";

const prisma = new PrismaClient();

export type UpdateUserDTO = {
  id?: number;
  name?: string;
  email?: string;
  phoneNumber?: string;
  emailVerified?: Date;
  image?: string;
  role?: string;
};

const expectedBody = Joi.object<UpdateUserDTO>({
  id: Joi.number(),
  name: Joi.string(),
  email: Joi.string(),
  phoneNumber: Joi.string(),
  emailVerified: Joi.date(),
  image: Joi.string(),
  role: Joi.string(),
});

// NOTE: deletes all viewer permissions if changing role to Admin
const handler = async (
  req: ValidatedNextApiRequest<UpdateUserDTO>,
  res: NextApiResponse
): Promise<void> => {
  try {
    const userInfo = req.body;
    const user =
      userInfo.role === "Admin"
        ? await prisma.user.update({
            where: { id: userInfo.id || Number(req.query.id) },
            data: {
              name: userInfo.name,
              email: userInfo.email,
              phoneNumber: userInfo.phoneNumber,
              emailVerified: userInfo.emailVerified,
              image: userInfo.image,
              isAdmin: true,
              viewerPermissions: {
                deleteMany: {
                  relationship_type: {
                    not: null,
                  },
                },
                create: {
                  relationship_type: "Admin",
                },
              },
            },
          })
        : await prisma.user.update({
            where: { id: userInfo.id || Number(req.query.id) },
            data: {
              name: userInfo.name,
              email: userInfo.email,
              phoneNumber: userInfo.phoneNumber,
              emailVerified: userInfo.emailVerified,
              image: userInfo.image,
              viewerPermissions: {
                updateMany: {
                  data: {
                    relationship_type: userInfo.role,
                  },
                  where: {
                    relationship_type: {
                      not: null,
                    },
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
