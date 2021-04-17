import { Absence, AbsenceReason, AbsenceType } from "@prisma/client";
import { IPlayer, IUser, ValidatedNextApiRequest } from "interfaces";
import Joi from "joi";
import { NextApiResponse } from "next";
import buildUserProfile from "utils/buildUserProfile";
import { filterPlayerProfileAbsenceWrite } from "utils/filterPlayerProfileWrite";
import flattenUserRoles from "utils/flattenUserRoles";
import getAuthenticatedUser from "utils/getAuthenticatedUser";
import prisma from "utils/prisma";
import { validateBody } from "../helpers";

export type UpdateOneAbsenceDTO = {
  date?: string;
  description?: string;
  type?: AbsenceType;
  reason?: AbsenceReason;
  userId?: number;
};

const expectedBody = Joi.object<UpdateOneAbsenceDTO>({
  date: Joi.string().isoDate(),
  description: Joi.string(),
  reason: Joi.valid(...Object.values(AbsenceReason)),
  type: Joi.valid(...Object.values(AbsenceType)),
  userId: Joi.number(),
});

const updateOneAbsenceHandler = async (
  req: ValidatedNextApiRequest<UpdateOneAbsenceDTO>,
  res: NextApiResponse
): Promise<void> => {
  let user: IUser;
  try {
    user = flattenUserRoles(await getAuthenticatedUser(req));
  } catch (err) {
    return res.status(401).json({ statusCode: 401, message: err.message });
  }

  const { id } = req.query;
  let absence: Absence | null;
  try {
    absence = await prisma.absence.findUnique({ where: { id: Number(id) } });
    if (!absence) {
      throw new Error("Absence not found");
    }
  } catch (err) {
    return res.status(404).json({
      statusCode: 404,
      message: "Could not find Absence to update.",
    });
  }

  let player: IPlayer | null;
  try {
    const playerUser = await prisma.user.findUnique({
      where: { id: absence.userId },
      include: {
        absences: true,
        profileFields: true,
        roles: true,
      },
    });
    if (!playerUser) {
      throw new Error("Player not found");
    }
    player = buildUserProfile(flattenUserRoles(playerUser));
  } catch (err) {
    return res.status(404).json({
      statusCode: 404,
      message: "Absence belongs to a player that does not exist.",
    });
  }

  const [update] = filterPlayerProfileAbsenceWrite(player, user, [
    { ...absence, ...req.body },
  ]);
  if (!update) {
    return res.status(401).json({
      statusCode: 401,
      message: "Not allowed to modify this Absence.",
    });
  }

  try {
    await prisma.absence.update({
      where: { id: Number(id) },
      data: {
        date: update.date,
        description: update.description,
        reason: update.reason,
        type: update.type,
        users: update.userId
          ? {
              connect: {
                id: update.userId,
              },
            }
          : undefined,
      },
    });
    return res.status(200).json({
      success: true,
    });
  } catch (err) {
    return res.status(500).json({ statusCode: 500, message: err.message });
  }
};

export default validateBody(updateOneAbsenceHandler, expectedBody);
