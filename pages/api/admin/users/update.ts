import { PrismaClient } from "@prisma/client";
import { ValidatedNextApiRequest, UserRoleType, UserStatus } from "interfaces";
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
  status?: UserStatus;
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
    const userInfo = req.body;

    let user;

    const roles =
      (userInfo.roles &&
        userInfo.roles.map((role) =>
          JSON.parse((role as unknown) as string)
        )) ||
      [];

    if (roles && roles[0].type === "Admin") {
      user = await prisma.user.update({
        where: { id: userInfo.id || Number(req.query.id) },
        data: {
          name: userInfo.name,
          email: userInfo.email,
          phoneNumber: userInfo.phoneNumber,
          status: userInfo.status,
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
      });
    } else {
      user = await prisma.user.update({
        where: { id: userInfo.id || Number(req.query.id) },
        data: {
          name: userInfo.name,
          email: userInfo.email,
          phoneNumber: userInfo.phoneNumber,
          status: userInfo.status,
          image: userInfo.image,
          hashedPassword: userInfo.hashedPassword,
          ...(roles !== undefined
            ? {
                roles: {
                  deleteMany: {
                    type: {
                      not: undefined,
                    },
                  },
                },
              }
            : {}),
        },
        include: {
          roles: true,
        },
      });

      if (roles !== undefined) {
        const allResults = await Promise.all(
          roles.map((role) => {
            return prisma.role.create({
              data: {
                type: role.type,
                relatedPlayer: role.relatedPlayerId
                  ? {
                      connect: {
                        id: role.relatedPlayerId,
                      },
                    }
                  : {},
                user: {
                  connect: {
                    id: role.userId,
                  },
                },
              },
              include: {
                user: {
                  include: {
                    roles: true,
                  },
                },
              },
            });
          })
        );

        user = allResults[allResults.length - 1].user;
      }
    }

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
