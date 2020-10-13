import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import sanitizeUser from "utils/sanitizeUser";
import hash from "utils/hashPassword";
import { SanitizedUser } from "interfaces";
import Joi from "joi";

const prisma = new PrismaClient();

/**
 * Name
 * Email
 */
type BaseCreateUserDTO = {
  name: string;
  email: string;
};

/**
 * Password (plaintext)
 */
export type UserSignupDTO = BaseCreateUserDTO & {
  password: string;
};

/**
 * Invite code
 */
type InviteUserDTO = BaseCreateUserDTO & {
  inviteCodeId: string;
};

type CreateUserDTO = UserSignupDTO | InviteUserDTO;

/**
 * Create an account with email and password (if user signing up) or invite code id (admin signing user up)
 * @param user - contains metadata
 */

export const createAccount = async (
  user: CreateUserDTO
): Promise<SanitizedUser | null> => {
  const newUser = await prisma.user.create({
    data: {
      email: user.email,
      hashedPassword:
        "password" in user ? hash(user.password) : "<created at first login>",
      // inviteCode: "inviteCodeId" in user ? user.inviteCodeId : "<not given>"
    },
  });
  if (!newUser) {
    return null;
  }
  return sanitizeUser(newUser);
};

const handler = (req: NextApiRequest, res: NextApiResponse): void => {
  console.log(req.body, req.method);
  try {
    const expectedBody = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().required(),
    });
    const { value, error } = expectedBody.validate(req.body);
    if (error) {
      throw new Error(error.message);
    }
    const body = value as CreateUserDTO;

    const newUser = createAccount(body);
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

export default handler;
