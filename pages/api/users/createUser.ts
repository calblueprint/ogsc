import { Player, PrismaClient, UserInvite } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import Joi from "joi";

const prisma = new PrismaClient();

type UserDTO = {
  id: number;
  name: string;
  email: string;
  emailVerified: Date;
  image: string;
  createdAt: Date;
  updatedAt: Date;
  hashedPassword: string;
  player: Player;
  userInvites: UserInvite[];
  viewedByPermissions: ViewingPermission[];
  viewerPermissions: ViewingPermission[];
};

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  try {
    const expectedBody = Joi.object({
      id: Joi.number().required(),
      name: Joi.string().required(),
      email: Joi.string().required(),
      email_verified: Joi.date().required(),
      image: Joi.string().required(),
      createdAt: Joi.date().required(),
      updatedAt: Joi.date().required(),
      player: Joi.object().ref(),
      hashedPassword: Joi.string().required(),
      viewedByPermissions: Joi.array().items(Joi.object()),
      viewerPermissions: Joi.array().items(Joi.object()),
    });

    const { value, error } = expectedBody.validate(req.body);
    if (error) {
      throw new Error(error.message);
    }
    const body = value as UserDTO;

    await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        emailVerified: body.emailVerified,
        image: body.image,
        createdAt: body.createdAt,
        updatedAt: body.updatedAt,
        hashedPassword: body.hashedPassword,
        player: body.player,
        userInvites: body.userInvites,
        viewedByPermissions: body.viewedByPermissions,
        viewerPermissions: body.viewerPermissions,
      },
    });
  } catch (err) {
    res.status(500);
    res.json({ statusCode: 500, message: err.message });
  }
};
