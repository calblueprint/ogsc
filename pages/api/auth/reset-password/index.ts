import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import sanitizeUser from "utils/sanitizeUser";
import hash from "utils/hashPassword";
import { SanitizedUser } from "interfaces";
import Joi from "lib/validate";

const prisma = new PrismaClient();

/**
 * User DTO with new password
 */
type NewPasswordUserDTO = {
  newPassword: string;
  resetCodeId: string;
};

/**
 * Completes forgot password flow by updating record with new password
 * @param user - contains newPassword, resetCodeId
 */

export const resetPassword = async (
  user: NewPasswordUserDTO
): Promise<SanitizedUser | null> => {
  if (
    Joi.string().uuid({ version: "uuidv4" }).validate(user.resetCodeId).error
  ) {
    throw new Error("Invalid resetCodeId");
  }

  const resetPasswordRecord = await prisma.resetPassword.findOne({
    where: { id: user.resetCodeId },
  });
  if (!resetPasswordRecord) {
    throw new Error("Invalid reset password id");
  }
  if (resetPasswordRecord.isUsed) {
    throw new Error("Reset password id has already been used");
  }

  // update resetPassword table with new password + isUsed
  const updatedResetPasswordRecord = await prisma.resetPassword.update({
    data: { isUsed: true },
    where: {
      id: user.resetCodeId,
    },
  });
  if (!updatedResetPasswordRecord) {
    throw new Error("Could not find account");
  }
  // update user table with new password
  const userRecord = await prisma.user.update({
    data: { hashedPassword: hash(user.newPassword) },
    where: {
      id: updatedResetPasswordRecord.userId,
    },
  });
  if (!userRecord) {
    throw new Error("Could not update password");
  }

  return sanitizeUser(userRecord);
};

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  try {
    const expectedBody = Joi.object({
      newPassword: Joi.string().required(),
      resetCodeId: Joi.string().required(),
    });
    const { value, error } = expectedBody.validate(req.body);
    if (error) {
      throw new Error(error.message);
    }
    const body = value as NewPasswordUserDTO;

    const newUser = await resetPassword(body);
    if (newUser) {
      res.status(200).json(newUser);
    } else {
      res.status(404).json({
        statusCode: 404,
        message: "Could not reset password",
      });
    }
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
};

export default handler;
