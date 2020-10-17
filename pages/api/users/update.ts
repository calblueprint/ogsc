import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import Joi from "joi";

const prisma = new PrismaClient();
type userDTO = {
  id: number;
  name: string;
  email: string;
  emailVerified: Date;
  image: string;
  hashedPassword: string;
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
      image: Joi.string(),
      hashedPassword: Joi.string(),
    });

    const { value, error } = expectedBody.validate(req.body);
    if (error) {
      throw new Error(error.message);
    }
    const userInfo = value as userDTO;

    const user = await prisma.user.update({
      where: { id: userInfo.id },
      data: {
        name: userInfo.name,
        email: userInfo.email,
        image: userInfo.image,
        hashedPassword: userInfo.hashedPassword,
      },
    });
    if (!user) {
      res
        .status(404)
        .json({ statusCode: 404, message: "User does not exist." });
    }
    res.json({
      message: "Successfully updated user.",
      user,
    });
  } catch (err) {
    res.status(500);
    res.json({ statusCode: 500, message: err.message });
  }
};
