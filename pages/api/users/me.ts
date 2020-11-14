import { PrismaClient } from "@prisma/client";
import { IPlayer, IUser } from "interfaces";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import buildUserProfile from "utils/buildUserProfile";
import sanitizeUser from "utils/sanitizeUser";
import { routeByMethod } from "../helpers";

const prisma = new PrismaClient();

export default routeByMethod({
  GET: async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    const session = await getSession({ req });
    if (!session) {
      res.statusCode = 401;
      res.json({ message: "You are not logged in." });
      return;
    }
    const user = await prisma.user.findOne({
      where: { email: session.user.email },
      include: {
        absences: true,
        profileFields: true,
        viewerPermissions: true,
        viewedByPermissions: true,
      },
    });

    if (user) {
      const response: IUser | IPlayer = sanitizeUser(buildUserProfile(user));
      res.json(response);
    } else {
      res.status(500).json({ message: "Could not find user." });
    }
  },
});
