import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import Joi from "joi";
import sanitizeUser from "utils/sanitizeUser";

const prisma = new PrismaClient();
type UserDTO = {
  id: number;
  name: string;
  email: string;
  emailVerified: Date;
  image: string;
  createdAt: Date;
  updatedAt: Date;
};

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  try {
    const expectedBody = Joi.object({
      id: Joi.number().required(),
      name: Joi.string(),
      email: Joi.string(),
      emailVerified: Joi.date(),
      image: Joi.string(),
      createdAt: Joi.date(),
      updatedAt: Joi.date(),
    });

    const { value, error } = expectedBody.validate(req.body);
    if (error) {
      throw new Error(error.message);
    }
    const userInfo = value as UserDTO;

    const user = await prisma.user.delete({
      where: { id: userInfo.id },
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
