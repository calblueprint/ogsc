import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import Joi from "joi";

const prisma = new PrismaClient();
type ViewingPermissionDTO = {
  id: number;
  viewerId: number;
  vieweeId: number;
  relationshipType: string;
};
const expectedBody = Joi.object({
  id: Joi.number().required(),
  viewerId: Joi.number().required(),
  vieweeId: Joi.number().required(),
  relationshipType: Joi.string().required(),
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
    const permissionInfo = value as ViewingPermissionDTO;

    const view = await prisma.viewingPermission.create({
      data: {
        id: permissionInfo.id,
        viewer: { connect: { id: permissionInfo.viewerId } },
        viewee: { connect: { id: permissionInfo.vieweeId } },
        relationship_type: permissionInfo.relationshipType,
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
