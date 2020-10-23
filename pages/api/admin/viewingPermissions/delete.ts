import { PrismaClient } from "@prisma/client";
import { NextApiResponse } from "next";
import Joi from "joi";
import { ValidatedNextApiRequest } from "interfaces";
import { validateBody } from "pages/api/helpers";
import { adminOnlyHandler } from "../helpers";

const prisma = new PrismaClient();

type DeleteViewingPermissionDTO = {
  id?: number;
};

const expectedBody = Joi.object<DeleteViewingPermissionDTO>({
  id: Joi.number(),
});

const handler = async (
  req: ValidatedNextApiRequest<DeleteViewingPermissionDTO>,
  res: NextApiResponse
): Promise<void> => {
  try {
    const view = await prisma.viewingPermission.delete({
      where: { id: req.body.id || Number(req.query.id) },
    });
    res.json({
      message: "Successfully deleted viewing permission.",
      view,
    });
  } catch (err) {
    res.status(500);
    res.json({ statusCode: 500, message: err.message });
  }
};

export default validateBody(adminOnlyHandler(handler), expectedBody);
