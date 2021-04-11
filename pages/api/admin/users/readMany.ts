import { Prisma, UserRoleType, UserStatus } from "@prisma/client";
import { IUser } from "interfaces";
import { NextApiRequest, NextApiResponse } from "next";
import flattenUserRoles from "utils/flattenUserRoles";
import prisma from "utils/prisma";
import sanitizeUser from "utils/sanitizeUser";
import { USER_PAGE_SIZE } from "../../../../constants";

export type ReadManyUsersDTO = {
  users: IUser[];
  total: number;
};

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const pageNumber: number = Number(req.query.pageNumber) || 0;
  const userRole = req.query.role as UserRoleType | undefined;
  const search = req.query.search as string | undefined;
  const includeOnlyAdminUnapproved = req.query.admin_unapproved as
    | string
    | undefined;
  const includeOnlyInactive = req.query.inactive as string | undefined;
  const includeOnlyUserUnaccepted = req.query.user_unaccepted as
    | string
    | undefined;
  try {
    const filterArgs: Prisma.FindManyUserArgs = {
      where: {
        ...(userRole
          ? {
              roles: {
                some: {
                  type: userRole,
                },
              },
            }
          : { status: UserStatus.Active }),
        ...(search
          ? {
              name: {
                contains: search,
                mode: "insensitive",
              },
            }
          : undefined),
        ...(includeOnlyAdminUnapproved
          ? {
              status: UserStatus.PendingAdminApproval,
            }
          : undefined),
        ...(includeOnlyUserUnaccepted
          ? {
              status: UserStatus.PendingUserAcceptance,
            }
          : undefined),
        ...(includeOnlyInactive
          ? {
              status: UserStatus.Inactive,
            }
          : undefined),
      },
    };

    const users = await prisma.user.findMany({
      ...filterArgs,
      include: {
        roles: true,
      },
      skip: Number(USER_PAGE_SIZE) * pageNumber,
      take: Number(USER_PAGE_SIZE),
    });
    const userCount = await prisma.user.count(filterArgs);

    if (!users) {
      res
        .status(404)
        .json({ statusCode: 404, message: "User does not exist." });
    } else {
      res.json({
        users: users.map(sanitizeUser).map(flattenUserRoles),
        total: userCount,
      } as ReadManyUsersDTO);
    }
  } catch (err) {
    res.status(500);
    res.json({ statusCode: 500, message: err.message });
  }
};
