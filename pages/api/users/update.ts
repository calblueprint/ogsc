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
    const body = value as userDTO;

    const user = await prisma.user.update({
      where: { id: body.id },
      data: {
        name: body.name,
        email: body.email,
        image: body.image,
        hashedPassword: body.hashedPassword,
      },
    });
    res.json({
      message: "Successfully updated user.",
      user,
    });
  } catch (err) {
    res.status(500);
    res.json({ statusCode: 500, message: err.message });
  }
};
