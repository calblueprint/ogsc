import { PrismaClient, PrismaClientKnownRequestError } from "@prisma/client";
import { NextApiResponse } from "next";
import Joi from "joi";
import { ValidatedNextApiRequest } from "interfaces";
import Notifier from "lib/notify";
import { NotificationType } from "lib/notify/types";
import { validateBody } from "pages/api/helpers";
import { adminOnlyHandler } from "../helpers";

const prisma = new PrismaClient();

export type AdminCreateUserDTO = {
  name: string;
  email: string;
  phoneNumber?: string | undefined;
  role?: string | undefined;
  linkedPlayers?: number[] | undefined;
};

const AdminCreateUserDTOValidator = Joi.object<AdminCreateUserDTO>({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phoneNumber: Joi.string().optional(),
  role: Joi.string().optional(),
  linkedPlayers: Joi.array().items(Joi.number().required()).optional(),
});

const handler = async (
  req: ValidatedNextApiRequest<AdminCreateUserDTO>,
  res: NextApiResponse
): Promise<void> => {
  const { name, email, phoneNumber, role, linkedPlayers } = req.body;
  try {
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        phoneNumber,
        hashedPassword: "<set on first login>",
        userInvites: {
          create: {},
        },
        viewerPermissions: {
          create: linkedPlayers?.map((playerID: number) => ({
            relationship_type: role?.concat(" to Player"),
            viewee: {
              connect: {
                id: playerID,
              },
            },
          })),
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
