import { PrismaClient } from "@prisma/client";
import { AuthenticatedNextApiHandler, UserRoleType } from "interfaces";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import flattenUserRoles from "utils/flattenUserRoles";

const prisma = new PrismaClient();

export const adminOnlyHandler = (
  handler: AuthenticatedNextApiHandler
) => async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const session = await getSession({ req });
  if (!session) {
    res.statusCode = 401;
    res.json({ message: "You are not logged in." });
    return;
  }
  const user = await prisma.user.findOne({
    where: { email: session.user.email },
    include: { roles: true },
  });
  if (
    user === null ||
    flattenUserRoles(user).defaultRole?.type !== UserRoleType.Admin
  ) {
    res.statusCode = 401;
    res.json({
      message:
        "You need to be logged in as an administrator to perform this function.",
    });
    return;
  }

  handler(req, res, user);
};

export default {
  adminOnlyHandler,
};
