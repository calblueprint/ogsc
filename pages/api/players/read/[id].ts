import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import Joi from "joi";

type ProfileDTO = {
  id: number;
  bio?: string;
  academicEngagementScore?: number;
  academicEngagementComments?: string;
  advisingScore?: number;
  advisingComments?: string;
  gpa?: number;
  disciplinaryActions?: string;
  schoolAbsences?: string;
  advisingAbsences?: string;
  bmi?: number;
  healthAndWellness?: string;
  beepTest?: string;
  mileTime?: string;
  highlights?: string;
};

const prisma = new PrismaClient();

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  try {
    const expectedbody = Joi.object({
      id: Joi.number().required(),
    });
    const { value, error } = expectedbody.validate(req.query);
    if (error) {
      throw new Error(error.message);
    }
    const player = value as ProfileDTO;
    const playerProfile = await prisma.player.findOne({
      where: { user_id: player.id },
      include: { user: { select: { name: true } } },
    });
    if (!playerProfile) {
      res
        .status(404)
        .json({ statusCode: 404, message: "Player does not exist." });
    }
    res.json(playerProfile);
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
};
export default handler;
