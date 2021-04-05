import {
  ProfileFieldKey,
  ProfileFieldCreateWithoutUserInput,
} from "@prisma/client";
import prisma from "utils/prisma";
import Joi from "lib/validate";
import { NextApiResponse } from "next";

import { ValidatedNextApiRequest } from "interfaces";
import type { PlayerProfileFormValues } from "pages/admin/players/playerForm";
import { validateBody } from "pages/api/helpers";
import sanitizeUser from "utils/sanitizeUser";
import filterPlayerProfileWrite from "utils/filterPlayerProfileWrite";
import buildUserProfile from "utils/buildUserProfile";
import flattenUserRoles from "utils/flattenUserRoles";
import getAuthenticatedUser from "utils/getAuthenticatedUser";

export type PlayerUserDTO = {
  id: number;
};

const expectedBody = Joi.object<PlayerProfileFormValues & PlayerUserDTO>({
  id: Joi.number().required(),
  [ProfileFieldKey.PlayerNumber]: Joi.string(),
  age: Joi.string(),
  [ProfileFieldKey.BioAboutMe]: Joi.string().allow(null),
  [ProfileFieldKey.BioHobbies]: Joi.string().allow(null),
  [ProfileFieldKey.BioFavoriteSubject]: Joi.string().allow(null),
  [ProfileFieldKey.BioMostDifficultSubject]: Joi.string().allow(null),
  [ProfileFieldKey.BioSiblings]: Joi.string().allow(null),
  [ProfileFieldKey.BioParents]: Joi.string().allow(null),
  [ProfileFieldKey.AcademicEngagementScore]: Joi.array()
    .items(Joi.string())
    .optional()
    .allow(null),
  [ProfileFieldKey.AdvisingScore]: Joi.array()
    .items(Joi.string())
    .optional()
    .allow(null),
  [ProfileFieldKey.AthleticScore]: Joi.array()
    .items(Joi.string())
    .optional()
    .allow(null),
  [ProfileFieldKey.GPA]: Joi.array().items(Joi.string()).optional().allow(null),
  [ProfileFieldKey.DisciplinaryActions]: Joi.array()
    .items(Joi.string())
    .optional()
    .allow(null),
  [ProfileFieldKey.BMI]: Joi.string().allow(null),
  [ProfileFieldKey.PacerTest]: Joi.string().allow(null),
  [ProfileFieldKey.MileTime]: Joi.string().allow(null),
  [ProfileFieldKey.Situps]: Joi.string().allow(null),
  [ProfileFieldKey.Pushups]: Joi.string().allow(null),
  [ProfileFieldKey.HealthAndWellness]: Joi.string().allow(null),
  [ProfileFieldKey.Highlights]: Joi.string().allow(null),
  [ProfileFieldKey.IntroVideo]: Joi.string().allow(null),
});

const handler = async (
  req: ValidatedNextApiRequest<PlayerProfileFormValues & PlayerUserDTO>,
  res: NextApiResponse
): Promise<void> => {
  try {
    const authenticatedUser = await getAuthenticatedUser(req);
    const userInfo = req.body;
    const profileFields = new Map<ProfileFieldKey, string | string[]>();
    Object.keys(userInfo).map((key) => {
      if (userInfo[key as ProfileFieldKey] && key !== "id" && key !== "age") {
        profileFields.set(
          key as ProfileFieldKey,
          userInfo[key as ProfileFieldKey]
        );
      }
      return null;
    });
    const newProfileFields: ProfileFieldCreateWithoutUserInput[] = [];

    profileFields.forEach((value, key) => {
      if (
        key === "AcademicEngagementScore" ||
        key === "AdvisingScore" ||
        key === "AthleticScore" ||
        key === "GPA"
      ) {
        const content = value as string[];
        content.forEach((object) => {
          const date = new Date(object.split("-")[1]);
          const number = object.split("-")[0];
          const comment =
            object.split("-").length === 3 ? object.split("-")[2] : "";
          newProfileFields.push({
            key,
            value: JSON.stringify({ comment, value: number }),
            createdAt: date,
          });
        });
      } else if (key === "DisciplinaryActions") {
        const content = value as string[];
        content.forEach((object) => {
          const date = new Date(object.split("-")[1]);
          const info = object.split("-")[0];
          newProfileFields.push({
            key,
            value: info,
            createdAt: date,
          });
        });
      } else {
        newProfileFields.push({
          key,
          value: value.toString(),
        });
      }
    });
    const playerId = userInfo.id || Number(req.query.id);
    const updatingUser = await prisma.user.findOne({
      where: { id: playerId },
      include: {
        absences: true,
        profileFields: true,
        roles: true,
      },
    });
    if (!updatingUser) {
      res
        .status(404)
        .json({ statusCode: 404, message: "User does not exist." });
      return;
    }
    const player = buildUserProfile(flattenUserRoles(updatingUser));
    const updatedUser = await prisma.user.update({
      where: { id: playerId },
      data: {
        profileFields: filterPlayerProfileWrite(
          player,
          flattenUserRoles(authenticatedUser),
          {
            create: newProfileFields,
          }
        ),
      },
    });
    res.json({
      message: "Successfully updated user.",
      user: sanitizeUser(updatedUser),
    });
  } catch (err) {
    res.status(500);
    res.json({ statusCode: 500, message: err.message });
  }
};

export default validateBody(handler, expectedBody);
