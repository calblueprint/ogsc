import { PrismaClient } from "@prisma/client";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";

const prisma = new PrismaClient();

export const adminOnlyHandler = (handler: NextApiHandler) => async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const session = await getSession({ req });
  if (!session) {
    res.statusCode = 401;
    res.json({ message: "You are not logged in." });
    return;
  }
  const user = await prisma.user.findOne({
    where: { email: session.user.email },
  });
  if (!user?.isAdmin) {
    res.statusCode = 401;
    res.json({
      message:
        "You need to be logged in as an administrator to perform this function.",
    });
    return;
  }
  handler(req, res);
};

export default {
  adminOnlyHandler,
};
