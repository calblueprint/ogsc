import prisma from "utils/prisma";
import { UserStatus } from "interfaces";
import { NextApiRequest, NextApiResponse } from "next";
import sanitizeUser from "utils/sanitizeUser";
import { adminOnlyHandler } from "../helpers";

const handler = async (
  _req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
      where: { status: UserStatus.PendingAdminApproval },
    });
    if (!users) {
      res.status(404).json({
        statusCode: 204,
        message: "No account requests.",
      });
    }
    res.json({
      users: users.map(sanitizeUser),
    });
  } catch (err) {
    res.status(500);
    res.json({ statusCode: 500, message: err.message });
  }
};

export default adminOnlyHandler(handler);
