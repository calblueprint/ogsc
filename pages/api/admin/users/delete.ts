import { Prisma } from "@prisma/client";
import { NextApiResponse } from "next";
import Joi from "lib/validate";
import { ValidatedNextApiRequest } from "interfaces";
import prisma from "utils/prisma";
import sanitizeUser from "utils/sanitizeUser";
import { validateBody } from "pages/api/helpers";
import { adminOnlyHandler } from "../helpers";

export type DeleteUserDTO = {
  id?: number;
};

const DeleteUserDTOValidator = Joi.object<DeleteUserDTO>({
  id: Joi.number(),
});

const handler = async (
  req: ValidatedNextApiRequest<DeleteUserDTO>,
  res: NextApiResponse
): Promise<void> => {
  const userId = req.body.id || Number(req.query.id);
  try {
    // TODO: Update to only delete user when prisma/prisma#2057 is fixed.
    await prisma.userInvite.deleteMany({
      where: { user_id: userId },
    });
    await prisma.role.deleteMany({
      where: { OR: [{ userId }, { relatedPlayerId: userId }] },
    });
    await prisma.absence.deleteMany({
      where: { userId },
    });
    await prisma.profileField.deleteMany({
      where: { userId },
    });
    await prisma.resetPassword.deleteMany({
      where: { userId },
    });
    const user = await prisma.user.delete({
      where: { id: userId },
    });
    res.json({
      message: "Successfully deleted user.",
      user: sanitizeUser(user),
    });
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2016"
    ) {
      res.status(404).json({ statusCode: 404, message: "User not found" });
    } else {
      res.status(500);
      res.json({ statusCode: 500, message: err.message });
    }
  }
};

export default validateBody(adminOnlyHandler(handler), DeleteUserDTOValidator);
