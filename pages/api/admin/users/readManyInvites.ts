import { FindManyUserArgs, User } from "@prisma/client";
import prisma from "utils/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import sanitizeUser from "utils/sanitizeUser";
import flattenUserRoles from "utils/flattenUserRoles";

export type ReadVerifiedUsersDTO = {
  users: User;
};

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const user1 = ((req.query.emailVerified as unknown) as unknown) as
    | User
    | undefined;
  // const search = req.query.search as string | undefined;
  try {
    const filterVerifiedEmail: FindManyUserArgs = {
      where: {
        ...(user1
          ? {
              emailVerified: null,
            }
          : undefined),
      },
    };
    const users = await prisma.user.findMany({
      ...filterVerifiedEmail,
      include: {
        roles: true,
      },
    });

    const userCount = await prisma.user.count(filterVerifiedEmail);
    if (!users) {
      res
        .status(404)
        .json({ statusCode: 404, message: "User does not exist." });
    } else {
      res.json(({
        users: users.map(sanitizeUser).map(flattenUserRoles),
        total: userCount,
      } as unknown) as ReadVerifiedUsersDTO);
    }
  } catch (err) {
    res.status(500);
    res.json({ statusCode: 500, message: err.message });
  }
};
