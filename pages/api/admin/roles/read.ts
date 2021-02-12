import prisma from "utils/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { adminOnlyHandler } from "../helpers";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  try {
    const view = await prisma.role.findUnique({
      where: { id: Number(req.query.id) },
    });
    if (!view) {
      res.status(404).json({
        statusCode: 404,
        message: "Viewing Permission does not exist.",
      });
    }
    res.json(view);
  } catch (err) {
    res.status(500);
    res.json({ statusCode: 500, message: err.message });
  }
};

export default adminOnlyHandler(handler);
