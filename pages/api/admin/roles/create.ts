import { PrismaClient, UserRoleType } from "@prisma/client";
import { NextApiResponse } from "next";
import Joi from "lib/validate";
import { ValidatedNextApiRequest } from "interfaces";
import { validateBody } from "pages/api/helpers";
import { adminOnlyHandler } from "../helpers";

const prisma = new PrismaClient();

export type ViewingPermissionDTO = {
  type: UserRoleType;
  userId: number;
  relatedPlayerId?: number;
};

const expectedBody = Joi.object<ViewingPermissionDTO>({
  userId: Joi.number().required(),
  relatedPlayerId: Joi.number(),
  type: Joi.string()
    .valid(...Object.values(UserRoleType))
    .required(),
});

const handler = async (
  req: ValidatedNextApiRequest<ViewingPermissionDTO>,
  res: NextApiResponse
): Promise<void> => {
  try {
    const permissionInfo = req.body;
    const view = await prisma.role.create({
      data: {
        user: { connect: { id: permissionInfo.userId } },
        relatedPlayer: permissionInfo.relatedPlayerId
          ? { connect: { id: permissionInfo.relatedPlayerId } }
          : undefined,
        type: permissionInfo.type,
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
