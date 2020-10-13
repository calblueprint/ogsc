import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import sanitizeUser from "utils/sanitizeUser";
import hash from "utils/hashPassword";
import { SanitizedUser } from "interfaces";
import Joi from "joi";
import { getInviteById } from "../invites/[id]";

const prisma = new PrismaClient();

/**
 * All users signing up
 */
type CreateUserDTO = {
  name: string;
  email: string;
  password: string;
  inviteCodeId?: string;
};

/**
 * Create an account with email and password (if user signing up) or invite code id (admin signing user up)
 * @param user - contains metadata
 */

export const createAccount = async (
  user: CreateUserDTO
): Promise<SanitizedUser | null> => {
  const loginInfo = {
    name: user.name,
    email: user.email,
    hashedPassword: hash(user.password),
  };
  const newUser = await prisma.user.upsert({
    where: {
      id: user.inviteCodeId
        ? (await getInviteById(user.inviteCodeId))?.user.id
        : undefined,
    },
    create: loginInfo,
    update: loginInfo,
  });
  if (!newUser) {
    return null;
  }
  return sanitizeUser(newUser);
};

const handler = async (req: NextApiRequest, res: NextApiResponse): void => {
  console.log(req.body, req.method);
  try {
    const expectedBody = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().required(),
      password: Joi.string().required(),
      inviteCodeId: Joi.string().optional(),
    });
    const { value, error } = expectedBody.validate(req.body);
    if (error) {
      throw new Error(error.message);
    }
    const body = value as CreateUserDTO;

    const newUser = await createAccount(body);
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
