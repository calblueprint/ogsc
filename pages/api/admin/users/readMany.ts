import { FindManyUserArgs, PrismaClient } from "@prisma/client";
import { IUser, UserRoleType } from "interfaces";
import { NextApiRequest, NextApiResponse } from "next";
import flattenUserRoles from "utils/flattenUserRoles";
import sanitizeUser from "utils/sanitizeUser";
import { USER_PAGE_SIZE } from "../../../../constants";

const prisma = new PrismaClient();

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
  const search: string = String(req.query.search) || " ";
  try {
    let filterArgs: FindManyUserArgs = {};

    if (userRole) {
      filterArgs = {
        ...filterArgs,
        where: {
          ...filterArgs.where,
          roles: {
            some: {
              type: userRole,
            },
          },
        },
      };
    }

    filterArgs = {
      ...filterArgs,
      where: {
        ...filterArgs.where,
        name: {
          contains: search,
          mode: "insensitive",
        },
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
