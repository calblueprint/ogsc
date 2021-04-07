import { NextApiRequest, NextApiResponse } from "next";
import { ResetPassword } from "@prisma/client";
import prisma from "utils/prisma";
import Joi from "lib/validate";
import Notifier from "lib/notify";
import { NotificationType } from "lib/notify/types";
import { UserStatus } from "interfaces";

/**
 * Users who forgot their password
 */
export type ForgotPasswordUserDTO = {
  email: string;
};

/**
 * Start forgot password flow
 * @param user - contains email
 */

export const forgotPassword = async (
  user: ForgotPasswordUserDTO
): Promise<ResetPassword | null> => {
  const resetUser = await prisma.user.findOne({
    where: { email: user.email },
  });
  if (!resetUser || resetUser.status !== UserStatus.Active) {
    throw new Error("No account under that email exists");
  }

  // create user record
  const newResetUser = await prisma.resetPassword.create({
    data: {
      user: { connect: { email: user.email } },
    },
  });
  if (!newResetUser) {
    return null;
  }
  // send email with reset password token
  await Notifier.sendNotification(NotificationType.ForgotPassword, {
    email: user.email,
    resetPasswordToken: newResetUser.id,
  });
  return newResetUser;
};

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  try {
    const expectedBody = Joi.object({
      email: Joi.string().email().required(),
    });
    const { value, error } = expectedBody.validate(req.body);
    if (error) {
      throw new Error(error.message);
    }
    const body = value as ForgotPasswordUserDTO;

    const newResetUser = await forgotPassword(body);
    if (newResetUser) {
      res.status(200).json(newResetUser);
    } else {
      res.status(404).json({
        statusCode: 404,
        message: "Could not start forgot password flow",
      });
    }
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
};

export default handler;
