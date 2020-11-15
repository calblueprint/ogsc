import { PrismaClient, ProfileFieldKey } from "@prisma/client";
import { ValidatedNextApiRequest } from "interfaces";
import Joi from "joi";
import { NextApiResponse } from "next";
import { validateBody } from "pages/api/helpers";

import sanitizeUser from "utils/sanitizeUser";
import type { PlayerProfileFormValues } from "pages/admin/players/playerForm";
import { adminOnlyHandler } from "../../helpers";

const prisma = new PrismaClient();

type PlayerUserDTO = {
  id: number;
};

const expectedBody = Joi.object<PlayerProfileFormValues & PlayerUserDTO>({
  id: Joi.number().required(),
  playerNumber: Joi.string(),
  age: Joi.string(),
  aboutMe: Joi.string(),
  hobbies: Joi.string(),
  favoriteSubject: Joi.string(),
  mostDifficultSubject: Joi.string(),
  siblings: Joi.string(),
  parents: Joi.string(),
  schoolScore: Joi.string(),
  academicScore: Joi.string(),
  athleticsScore: Joi.string(),
  gpa: Joi.string(),
  disciplinaryActions: Joi.string(),
  school: Joi.string(),
  academic: Joi.string(),
  athletics: Joi.string(),
  bmi: Joi.string(),
  beepTest: Joi.string(),
  mileTime: Joi.string(),
  sitUps: Joi.string(),
  pushUps: Joi.string(),
  healthWellness: Joi.string(),
  video: Joi.string(),
});

const handler = async (
  req: ValidatedNextApiRequest<PlayerProfileFormValues & PlayerUserDTO>,
  res: NextApiResponse
): Promise<void> => {
  try {
    const userInfo = req.body;
    const user = await prisma.user.update({
      where: { id: userInfo.id || Number(req.query.id) },
      data: {
        profileFields: {
          create: [
            { key: ProfileFieldKey.BioAboutMe, value: userInfo.aboutMe },
            { key: ProfileFieldKey.BioHobbies, value: userInfo.hobbies },
            {
              key: ProfileFieldKey.BioFavoriteSubject,
              value: userInfo.favoriteSubject,
            },
            {
              key: ProfileFieldKey.BioMostDifficultSubject,
              value: userInfo.mostDifficultSubject,
            },
            { key: ProfileFieldKey.BioSiblings, value: userInfo.siblings },
            { key: ProfileFieldKey.BioParents, value: userInfo.parents },
            {
              key: ProfileFieldKey.AcademicEngagementScore,
              value: userInfo.academicScore,
            },
            { key: ProfileFieldKey.AdvisingScore, value: userInfo.schoolScore },
            {
              key: ProfileFieldKey.AthleticScore,
              value: userInfo.athleticsScore,
            },
            { key: ProfileFieldKey.GPA, value: userInfo.gpa },
            {
              key: ProfileFieldKey.DisciplinaryActions,
              value: userInfo.disciplinaryActions,
            },
            { key: ProfileFieldKey.BMI, value: userInfo.bmi },
            { key: ProfileFieldKey.PacerTest, value: userInfo.beepTest },
            { key: ProfileFieldKey.MileTime, value: userInfo.mileTime },
            { key: ProfileFieldKey.Situps, value: userInfo.sitUps },
            { key: ProfileFieldKey.Pushups, value: userInfo.pushUps },
            {
              key: ProfileFieldKey.HealthAndWellness,
              value: userInfo.healthWellness,
            },
            { key: ProfileFieldKey.Highlights, value: userInfo.video },
          ],
        },
      },
    });
    if (!user) {
      res
        .status(404)
        .json({ statusCode: 404, message: "User does not exist." });
    }
    res.json({
      message: "Successfully updated user.",
      user: sanitizeUser(user),
    });
  } catch (err) {
    res.status(500);
    res.json({ statusCode: 500, message: err.message });
  }
};

export default validateBody(adminOnlyHandler(handler), expectedBody);
