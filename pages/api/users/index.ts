import { NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import sanitizeUser from "utils/sanitizeUser";
import hash from "utils/hashPassword";
import { SanitizedUser, ValidatedNextApiRequest } from "interfaces";
import Joi from "joi";
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
  inviteCodeId?: string;
};

export const CreateUserDTOValidator = Joi.object<CreateUserDTO>({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  inviteCodeId: Joi.string().optional(),
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
  const loginInfo = {
    name: user.name,
    email: user.email,
    hashedPassword: hash(user.password),
  };
  let newUser;
  const inviteCode = user.inviteCodeId
    ? await getInviteById(user.inviteCodeId)
    : null;
  if (inviteCode) {
    // inviteCodeId exists and valid invite code fetched
    newUser = await prisma.user.update({
      data: loginInfo,
      where: {
        id: inviteCode.user_id,
      },
    });
  } else {
    // signing up without an invite code
    newUser = await prisma.user.create({
      data: loginInfo,
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
