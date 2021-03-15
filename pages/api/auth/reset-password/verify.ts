import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import Joi from "lib/validate";

const prisma = new PrismaClient();

export type VerifyResetPasswordDTO = {
  resetCodeId: string;
};

// returns null if resetCodeId is invalid
export const verifyResetPassword = async (
  user: VerifyResetPasswordDTO
): Promise<string | null> => {
  if (
    Joi.string().uuid({ version: "uuidv4" }).validate(user.resetCodeId).error
  ) {
    return null;
  }

  const resetPasswordRecord = await prisma.resetPassword.findOne({
    where: { id: user.resetCodeId },
  });
  if (!resetPasswordRecord || resetPasswordRecord.isUsed) {
    return null;
  }
  return user.resetCodeId;
};

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  try {
    const expectedBody = Joi.object({
      resetCodeId: Joi.string().required(),
    });
    const { value, error } = expectedBody.validate(req.body);
    if (error) {
      throw new Error(error.message);
    }
    const body = value as VerifyResetPasswordDTO;

    const resetCodeId = await verifyResetPassword(body);
    if (resetCodeId) {
      res.status(200).json(resetCodeId);
    } else {
      res.status(404).json({
        statusCode: 404,
        message: "Invalid reset password ID",
      });
    }
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
};

export default handler;
