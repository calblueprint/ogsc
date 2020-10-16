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
      bio: Joi.string().optional(),
      academicEngagementScore: Joi.number().optional(),
      academicEngagementComments: Joi.string().optional(),
      advisingScore: Joi.number().optional(),
      advisingComments: Joi.string().optional(),
      gpa: Joi.number().optional(),
      disciplinaryActions: Joi.string().optional(),
      schoolAbsences: Joi.string().optional(),
      advisingAbsences: Joi.string().optional(),
      bmi: Joi.number().optional(),
      healthAndWellness: Joi.string().optional(),
      beepTest: Joi.string().optional(),
      mileTime: Joi.string().optional(),
      highlights: Joi.string().optional(),
    });
    const { value, error } = expectedbody.validate(req.body);
    if (error) {
      throw new Error(error.message);
    }
    const player = value as ProfileDTO;
    const playerProfile = await prisma.player.delete({
      where: { user_id: player.id },
    });
    res.json(playerProfile);
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
};
export default handler;
