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
  viewer_id: Joi.number().required(),
  viewee_id: Joi.number().required(),
  relationship_type: Joi.string().required(),
});

const handler = async (
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
        viewer: { connect: { id: body.viewer_id } },
        viewee: { connect: { id: body.viewee_id } },
        relationship_type: body.relationship_type,
      },
    });
    res.json({
      message: "Successfully created viewing permission.",
      view,
    });
  } catch (err) {
    res.status(500);
    res.json({ statusCode: 500, message: err.message });
  }
};
export default handler;
