import { FindManyUserArgs, PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import sanitizeUser from "utils/sanitizeUser";
import { USER_PAGE_SIZE } from "../../../../constants";

const prisma = new PrismaClient();

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const pageNumber: number = Number(req.query.pageNumber) || 0;
  const userRole: string = String(req.query.role) || "All Roles";
  const search: string = String(req.query.search) || " ";
  try {
    let filterArgs: FindManyUserArgs = {};

    if (userRole === "All Roles") {
      filterArgs = { ...filterArgs };
    } else if (userRole === "Admin") {
      filterArgs = {
        where: {
          isAdmin: true,
        },
      };
    } else if (userRole === "Players") {
      filterArgs = {
        where: {
          viewerPermissions: {
            some: {
              relationship_type: {
                equals: `${userRole.substr(0, userRole.length - 1)}`,
              },
            },
          },
        },
      };
    } else {
      filterArgs = {
        where: {
          viewerPermissions: {
            some: {
              relationship_type: {
                equals: `${userRole.substr(0, userRole.length - 1)} to Player`,
              },
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
        viewerPermissions: true,
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
      res.json({ users: users.map(sanitizeUser), total: userCount });
    }
  } catch (err) {
    res.status(500);
    res.json({ statusCode: 500, message: err.message });
  }
};
