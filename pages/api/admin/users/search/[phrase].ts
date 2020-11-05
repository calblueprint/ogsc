import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import sanitizeUser from "utils/sanitizeUser";

const prisma = new PrismaClient();

export function titleCase(str: string): string {
  const string = str.toLowerCase().split(" ");
  for (let i = 0; i < string.length; i += 1) {
    string[i] = string[i].charAt(0).toUpperCase() + string[i].slice(1);
  }
  return string.join(" ");
}

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const phrase: string = String(req.query.phrase) || "";
  try {
    const user = await prisma.user.findMany({
      where: {
        OR: [
          {
            name: {
              contains: titleCase(phrase),
            },
          },
          {
            name: {
              contains: phrase,
            },
          },
        ],
        viewedByPermissions: {
          some: {
            relationship_type: "player",
          },
        },
      },
    });

    if (!user) {
      res
        .status(404)
        .json({ statusCode: 404, message: "User does not exist." });
    } else {
      res.json({ users: user.map(sanitizeUser) });
    }
  } catch (err) {
    res.status(500);
    res.json({ statusCode: 500, message: err.message });
  }
};
