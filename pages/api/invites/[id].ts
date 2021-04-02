import { UserInvite } from "@prisma/client";
import prisma from "utils/prisma";
import { SanitizedUser } from "interfaces";
import Joi from "lib/validate";
import { NextApiRequest, NextApiResponse } from "next";
import sanitizeUser from "utils/sanitizeUser";

/**
 * Retrieve a UserInvite by its UUID and include the user object.
 * @param id - the ID of the UserInvite
 */
export const getInviteById = async (
  id: string
): Promise<(UserInvite & { user: SanitizedUser }) | null> => {
  if (Joi.string().uuid({ version: "uuidv4" }).validate(id).error) {
    return null;
  }
  const invite = await prisma.userInvite.findOne({
    where: { id },
    include: { user: true },
  });
  if (!invite) {
    return null;
  }
  return { ...invite, user: sanitizeUser(invite.user) };
};

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const id = req.query.id as string;
  try {
    const userInvite = await getInviteById(id);
    if (userInvite) {
      res.status(200).json(userInvite);
    } else {
      res
        .status(404)
        .json({ statusCode: 404, message: "Could not find invite" });
    }
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
};

export default handler;
