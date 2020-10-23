import { PrismaClient } from "@prisma/client";
import { NextApiResponse } from "next";
import Joi from "joi";
import { ValidatedNextApiRequest } from "interfaces";
import { validateBody } from "pages/api/helpers";
import { adminOnlyHandler } from "../helpers";

const prisma = new PrismaClient();

type ViewingPermissionDTO = {
  id: number;
  viewerId: number;
  vieweeId: number;
  relationshipType: string;
};

const expectedBody = Joi.object<ViewingPermissionDTO>({
  id: Joi.number().required(),
  viewerId: Joi.number().required(),
  vieweeId: Joi.number().required(),
  relationshipType: Joi.string().required(),
});

const handler = async (
  req: ValidatedNextApiRequest<ViewingPermissionDTO>,
  res: NextApiResponse
): Promise<void> => {
  try {
    const permissionInfo = req.body;
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
export default validateBody(adminOnlyHandler(handler), expectedBody);
