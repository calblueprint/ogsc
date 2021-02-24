import { PrismaClient } from "@prisma/client";
import { ValidatedNextApiRequest, UserRoleType } from "interfaces";
import Joi from "lib/validate";
import { NextApiResponse } from "next";
import { validateBody } from "pages/api/helpers";
import flattenUserRoles from "utils/flattenUserRoles";
import sanitizeUser from "utils/sanitizeUser";
import { adminOnlyHandler } from "../helpers";

const prisma = new PrismaClient();

export type UpdateUserDTO = {
  id?: number;
  name?: string;
  email?: string;
  phoneNumber?: string;
  image?: string;
  roles: [UserRoleType];
  hashedPassword?: string;
};

const expectedBody = Joi.object<UpdateUserDTO>({
  id: Joi.number(),
  name: Joi.string(),
  email: Joi.string(),
  phoneNumber: Joi.string().phoneNumber({
    defaultCountry: "US",
    format: "national",
  }),
  image: Joi.string(),
  roles: Joi.array().items(Joi.string()),
  hashedPassword: Joi.string(),
});

// NOTE: deletes all viewer permissions if changing role to Admin
const handler = async (
  req: ValidatedNextApiRequest<UpdateUserDTO>,
  res: NextApiResponse
): Promise<void> => {
  try {
    const { roles = [], ...userInfo } = req.body;
    const user =
      roles[0] === "Admin"
        ? await prisma.user.update({
            where: { id: userInfo.id || Number(req.query.id) },
            data: {
              name: userInfo.name,
              email: userInfo.email,
              phoneNumber: userInfo.phoneNumber,
              image: userInfo.image,
              hashedPassword: userInfo.hashedPassword,
              roles: {
                deleteMany: {
                  type: {
                    not: undefined,
                  },
                },
                create: {
                  type: UserRoleType.Admin,
                },
              },
            },
            include: {
              roles: true,
            },
          })
        : await prisma.user.update({
            where: { id: userInfo.id || Number(req.query.id) },
            data: {
              name: userInfo.name,
              email: userInfo.email,
              phoneNumber: userInfo.phoneNumber,
              image: userInfo.image,
              hashedPassword: userInfo.hashedPassword,
              roles: {
                updateMany: {
                  data: {
                    type: roles[0],
                  },
                  where: {
                    type: {
                      not: undefined,
                    },
                  },
                },
              },
            },
            include: {
              roles: true,
            },
          });
    if (!user) {
      res
        .status(404)
        .json({ statusCode: 404, message: "User does not exist." });
    }
    res.json({
      message: "Successfully updated user.",
      user: flattenUserRoles(sanitizeUser(user)),
    });
  } catch (err) {
    res.status(500);
    res.json({ statusCode: 500, message: err.message });
  }
};

export default validateBody(adminOnlyHandler(handler), expectedBody);
