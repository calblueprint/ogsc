import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import Joi from "joi";

const prisma = new PrismaClient();

type UserDTO = {
  name: string;
  email: string;
  emailVerified: Date;
  image: string;
  createdAt: Date;
  updatedAt: Date;
  hashedPassword: string;
};

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  try {
    const expectedBody = Joi.object({
      name: Joi.string().required(),
      email: Joi.string(),
      emailVerified: Joi.date(),
      image: Joi.string(),
      createdAt: Joi.date().required(),
      updatedAt: Joi.date().required(),
      hashedPassword: Joi.string().required(),
    });

    const { value, error } = expectedBody.validate(req.body);
    if (error) {
      throw new Error(error.message);
    }
    const userInfo = value as UserDTO;

    const user = await prisma.user.create({
      data: {
        name: userInfo.name,
        email: userInfo.email,
        emailVerified: userInfo.emailVerified,
        image: userInfo.image,
        createdAt: userInfo.createdAt,
        updatedAt: userInfo.updatedAt,
        hashedPassword: userInfo.hashedPassword,
      },
    });
    res.json({
      message: "Successfully created user.",
      user,
    });
  } catch (err) {
    res.status(500);
    res.json({ statusCode: 500, message: err.message });
  }
};
