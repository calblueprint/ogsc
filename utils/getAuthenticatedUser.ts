import { Absence, ProfileField, Role, User } from "@prisma/client";
import prisma from "utils/prisma";
import { NextApiRequest } from "next";
import { getSession } from "next-auth/client";

async function getAuthenticatedUser(
  req: NextApiRequest
): Promise<
  User & {
    absences: Absence[];
    profileFields: ProfileField[];
    roles: Role[];
  }
> {
  const session = await getSession({ req });
  if (!session) {
    throw new Error("You are not logged in.");
  }
  const user = await prisma.user.findOne({
    where: { email: session.user.email },
    include: {
      absences: true,
      profileFields: true,
      roles: true,
    },
  });
  if (!user) {
    throw new Error("Could not find the authenticated user.");
  }
  return user;
}

export default getAuthenticatedUser;
