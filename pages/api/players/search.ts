import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";

import { IPlayer, IUser, UserRoleType } from "interfaces";
import buildUserProfile from "utils/buildUserProfile";
import filterPlayerProfileRead from "utils/filterPlayerProfileRead";
import flattenUserRoles from "utils/flattenUserRoles";
import sanitizeUser from "utils/sanitizeUser";
import { USER_PAGE_SIZE } from "../../../constants";

const prisma = new PrismaClient();

export default async (
  req: NextApiRequest,
  res: NextApiResponse<
    { users: IPlayer[] } | { statusCode: number; message: string }
  >
): Promise<void> => {
  const pageNumber: number = Number(req.query.pageNumber) || 0;
  const phrase = (req.query.phrase as string | undefined)?.trim();
  let authenticatedUser: IUser;

  try {
    const session = await getSession({ req });
    if (!session) {
      throw new Error("You are not logged in.");
    }
    const user = await prisma.user.findOne({
      where: { email: session.user.email },
      include: { roles: true },
    });
    if (!user) {
      throw new Error("Could not find the authenticated user.");
    }
    authenticatedUser = flattenUserRoles(user);
  } catch (err) {
    res.status(401).json({ statusCode: 401, message: err.message });
  }

  try {
    const user = await prisma.user.findMany({
      skip: USER_PAGE_SIZE * pageNumber,
      take: USER_PAGE_SIZE,
      where: {
        ...(phrase
          ? {
              name: {
                contains: phrase,
                mode: "insensitive",
              },
            }
          : undefined),
        roles: {
          some: {
            type: UserRoleType.Player,
          },
        },
      },
      include: {
        profileFields: true,
        roles: true,
      },
    });

    if (!user) {
      res
        .status(404)
        .json({ statusCode: 404, message: "User does not exist." });
    } else {
      res.json({
        users: user
          .map(sanitizeUser)
          .map(flattenUserRoles)
          .map(buildUserProfile)
          .map((player: IPlayer) =>
            filterPlayerProfileRead(player, authenticatedUser)
          ),
      });
    }
  } catch (err) {
    res.status(500);
    res.json({ statusCode: 500, message: err.message });
  }
};
