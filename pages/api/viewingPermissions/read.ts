import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import Joi from "joi";

const prisma = new PrismaClient();

type viewingPermissionDTO = {
  id: number;
  viewerId: number;
  vieweeId: number;
  relationshipType: string;
};

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  try {
    const expectedBody = Joi.object({
      id: Joi.number().required(),
      viewerId: Joi.number(),
      vieweeId: Joi.number(),
      relationshipType: Joi.string(),
    });

    const { value, error } = expectedBody.validate(req.body);
    if (error) {
      throw new Error(error.message);
    }
    const permissionInfo = value as viewingPermissionDTO;

    const view = await prisma.viewingPermission.findOne({
      where: { id: permissionInfo.id },
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