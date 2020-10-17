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
const expectedBody = Joi.object({
  id: Joi.number().required(),
  viewer_id: Joi.number(),
  viewee_id: Joi.number(),
  relationship_type: Joi.string(),
});

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  try {
    const { value, error } = expectedBody.validate(req.body);
    if (error) {
      throw new Error(error.message);
    }
    const body = value as viewingPermissionDTO;

    const view = await prisma.viewingPermission.create({
      data: {
        id: body.id,
        viewerId: body.viewerId,
        vieweeId: body.vieweeId,
        relationshipType: body.relationshipType,
      },
    });
    res.json(view);
  } catch (err) {
    res.status(500);
    res.json({ statusCode: 500, message: err.message });
  }
};
