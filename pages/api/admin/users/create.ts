import { PrismaClient, PrismaClientKnownRequestError } from "@prisma/client";
import { NextApiResponse } from "next";
import Joi from "joi";

import { ValidatedNextApiRequest } from "interfaces";
import Notifier from "lib/notify";
import { NotificationType } from "lib/notify/types";
import { validateBody } from "pages/api/helpers";
import { CreateUserDTO, CreateUserDTOValidator } from "pages/api/users";
import { adminOnlyHandler } from "../helpers";

const prisma = new PrismaClient();

type AdminCreateUserDTO = Pick<CreateUserDTO, "email" | "name">;
const AdminCreateUserDTOValidator = CreateUserDTOValidator.keys({
  password: Joi.forbidden(),
  inviteCodeId: Joi.forbidden(),
}) as Joi.ObjectSchema<AdminCreateUserDTO>;

const handler = async (
  req: ValidatedNextApiRequest<AdminCreateUserDTO>,
  res: NextApiResponse
): Promise<void> => {
  const { email, name } = req.body;
  try {
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        hashedPassword: "<set on first login>",
        userInvites: {
          create: {},
        },
      },
      include: {
        userInvites: true,
      },
    });
    await Notifier.sendNotification(NotificationType.SignUpInvitation, {
      email,
      inviteCodeId: newUser.userInvites[0].id,
    });
    res.json(newUser);
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError) {
      res.status(422).json({
        statusCode: 422,
        message: "User already exists with this email",
      });
    } else {
      res.status(500).json({ statusCode: 500, message: err.message });
    }
  }
};

export default validateBody(
  adminOnlyHandler(handler),
  AdminCreateUserDTOValidator
);
