import { PrismaClient } from "@prisma/client";
import { NextApiResponse } from "next";
import Joi from "joi";
import { ValidatedNextApiRequest } from "interfaces";
import sanitizeUser from "utils/sanitizeUser";
import { validateBody } from "pages/api/helpers";
import { adminOnlyHandler } from "../helpers";

const prisma = new PrismaClient();
type DeleteUserDTO = {
  id?: number;
};

const DeleteUserDTOValidator = Joi.object<DeleteUserDTO>({
  id: Joi.number(),
});

const handler = async (
  req: ValidatedNextApiRequest<DeleteUserDTO>,
  res: NextApiResponse
): Promise<void> => {
  try {
    const user = await prisma.user.delete({
      where: { id: req.body.id || Number(req.query.id) },
    });
    res.json({
      message: "Successfully deleted user.",
      user: sanitizeUser(user),
    });
  } catch (err) {
    res.status(500);
    res.json({ statusCode: 500, message: err.message });
  }
};

export default validateBody(adminOnlyHandler(handler), DeleteUserDTOValidator);
