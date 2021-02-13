import { NextApiResponse } from "next";
import { PrismaClient, UserRoleType } from "@prisma/client";
import sanitizeUser from "utils/sanitizeUser";
import hash from "utils/hashPassword";
import { SanitizedUser, ValidatedNextApiRequest } from "interfaces";
import Joi from "lib/validate";
import { validateBody } from "../helpers";
import { getInviteById } from "../invites/[id]";

const prisma = new PrismaClient();

/**
 * All users signing up
 */
export type CreateUserDTO = {
  name: string;
  email: string;
  password: string;
  phoneNumber?: string;
  inviteCodeId?: string;
  role?: UserRoleType;
};

export const CreateUserDTOValidator = Joi.object<CreateUserDTO>({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  phoneNumber: Joi.string()
    .phoneNumber({ defaultCountry: "US", format: "national", strict: true })
    .allow(""),
  inviteCodeId: Joi.string().allow(""),
  role: Joi.string()
    .valid(...Object.values(UserRoleType))
    .allow(null),
});

/**
 * Update existing user record with given password by fetching from user invite table (if signing up with an invite code)
 * OR create an account with given email and password (if user is signing up without invite code)
 * @param user - contains email, password, and an optional invite code
 */
export const createAccount = async (
  user: CreateUserDTO
): Promise<SanitizedUser | null> => {
  if (
    Joi.string().uuid({ version: "uuidv4" }).validate(user.inviteCodeId).error
  ) {
    throw new Error("Invalid inviteCodeId");
  }
  let newUser;
  const inviteCode = user.inviteCodeId
    ? await getInviteById(user.inviteCodeId)
    : null;
  if (inviteCode) {
    // inviteCodeId exists and valid invite code fetched
    newUser = await prisma.user.update({
      data: {
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        hashedPassword: hash(user.password),
        ...(user.role
          ? {
              roles: {
                create: {
                  type: user.role,
                },
              },
            }
          : undefined),
      },
      where: {
        id: inviteCode.user_id,
      },
    });
    // update acceptedAt in userInvite
    const userInviteEntry = await prisma.userInvite.update({
      where: { id: user.inviteCodeId },
      data: {
        accepted_at: new Date(),
      },
    });
    if (!userInviteEntry) {
      return null;
    }
  } else {
    // signing up without an invite code
    newUser = await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        hashedPassword: hash(user.password),
        ...(user.role
          ? {
              roles: {
                create: {
                  type: user.role,
                },
              },
            }
          : undefined),
      },
    });
  }
  if (!newUser) {
    return null;
  }
  return sanitizeUser(newUser);
};

const handler = async (
  req: ValidatedNextApiRequest<CreateUserDTO>,
  res: NextApiResponse
): Promise<void> => {
  try {
    const newUser = await createAccount(req.body);
    if (newUser) {
      res.status(200).json(newUser);
    } else {
      res
        .status(404)
        .json({ statusCode: 404, message: "Could not create user" });
    }
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
};

export default validateBody(handler, CreateUserDTOValidator);
