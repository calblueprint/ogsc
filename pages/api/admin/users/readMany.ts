import { PrismaClient } from "@prisma/client";
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
  let users = null;
  try {
    if (userRole === "All Roles") {
      users = await prisma.user.findMany({
        skip: Number(USER_PAGE_SIZE) * pageNumber,
        take: Number(USER_PAGE_SIZE),
        include: {
          viewerPermissions: true,
        },
      });
    } else if (userRole === "Admin") {
      users = await prisma.user.findMany({
        skip: Number(USER_PAGE_SIZE) * pageNumber,
        take: Number(USER_PAGE_SIZE),
        where: {
          isAdmin: true,
        },
        include: {
          viewerPermissions: true,
        },
      });
    } else {
      users = await prisma.user.findMany({
        skip: Number(USER_PAGE_SIZE) * pageNumber,
        take: Number(USER_PAGE_SIZE),
        where: {
          viewerPermissions: {
            some: {
              relationship_type: {
                equals: `${userRole.substr(0, userRole.length - 1)} to Player`,
              },
            },
          },
        },
        include: {
          viewerPermissions: true,
        },
      });
    }
    const userCount = await prisma.user.count();

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
