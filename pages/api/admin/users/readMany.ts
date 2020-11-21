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
  try {
    const user = await prisma.user.findMany({
      skip: Number(USER_PAGE_SIZE) * pageNumber,
      take: Number(USER_PAGE_SIZE),
      include: {
        viewerPermissions: true,
      },
    });

    const userCount = await prisma.user.count();

    if (!user) {
      res
        .status(404)
        .json({ statusCode: 404, message: "User does not exist." });
    } else {
      res.json({ users: user.map(sanitizeUser), total: userCount });
    }
  } catch (err) {
    res.status(500);
    res.json({ statusCode: 500, message: err.message });
  }
};
