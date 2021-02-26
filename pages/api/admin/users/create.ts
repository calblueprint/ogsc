import { PrismaClient, PrismaClientKnownRequestError } from "@prisma/client";
import { NextApiResponse } from "next";
import Joi from "lib/validate";
import { UserRoleType, ValidatedNextApiRequest } from "interfaces";
import Notifier from "lib/notify";
import { NotificationType } from "lib/notify/types";
import { validateBody } from "pages/api/helpers";
import { adminOnlyHandler } from "../helpers";

const prisma = new PrismaClient();

export type AdminCreateUserDTO = {
  name: string;
  email: string;
  phoneNumber?: string | undefined;
  role?: UserRoleType | undefined;
  linkedPlayers?: number[] | undefined;
};

const AdminCreateUserDTOValidator = Joi.object<AdminCreateUserDTO>({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phoneNumber: Joi.string()
    .phoneNumber({ defaultCountry: "US", format: "national", strict: true })
    .allow(""),
  role: Joi.string()
    .valid(...Object.values(UserRoleType))
    .allow(null),
  linkedPlayers: Joi.array().items(Joi.number()).allow(null),
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
        ...(role
          ? {
              roles: {
                create: linkedPlayers?.map((playerID: number) => ({
                  type: role,
                  relatedPlayer: {
                    connect: {
                      id: playerID,
                    },
                  },
                })),
              },
            }
          : undefined),
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
