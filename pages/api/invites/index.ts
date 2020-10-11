import { PrismaClient, UserCreateInput } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export const createUserWithInvite = async (
  createOptions: UserCreateInput
): Promise<void> => {
  await prisma.user.create({
    data: {
      ...createOptions,
      hashedPassword: "<reset on first login>",
    },
  });
};

const handler = (_: NextApiRequest, res: NextApiResponse): void => {
  try {
    // TODO: Add createUserWithInvite logic here
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
};

export default handler;
