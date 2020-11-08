import { PrismaClient } from "@prisma/client";
import { NextApiResponse } from "next";
import sanitizeUser from "utils/sanitizeUser";

const prisma = new PrismaClient();

export default async (res: NextApiResponse): Promise<void> => {
  try {
    const user = await prisma.user.findMany({
      where: { emailVerified: null },
    });

    if (!user) {
      res
        .status(404)
        .json({ statusCode: 204, message: "No user account requests" });
    } else {
      res.json({ users: user.map(sanitizeUser) });
    }
  } catch (err) {
    res.status(500);
    res.json({ statusCode: 500, message: err.message });
  }
};
