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
    const body = value as viewingPermissionDTO;

    await prisma.user.create({
      data: {
        id: expectedBody.id,
        viewerId: body.viewer_id,
        vieweeId: body.viewee_id,
        relationshipType: body.relationship_type,
      },
    });
  } catch (err) {
    res.status(500);
    res.json({ statusCode: 500, message: err.message });
  }
};
