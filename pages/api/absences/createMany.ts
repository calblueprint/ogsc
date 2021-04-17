import { AbsenceReason, AbsenceType } from "@prisma/client";
import { IPlayer, IUser, ValidatedNextApiRequest } from "interfaces";
import Joi from "joi";
import { NextApiResponse } from "next";
import superjson from "superjson";
import buildUserProfile from "utils/buildUserProfile";
import filterPlayerProfileRead from "utils/filterPlayerProfileRead";
import { filterPlayerProfileAbsenceWrite } from "utils/filterPlayerProfileWrite";
import flattenUserRoles from "utils/flattenUserRoles";
import getAuthenticatedUser from "utils/getAuthenticatedUser";
import getPlayerById from "utils/getPlayerById";
import { AbsenceValidator } from "utils/isAbsence";
import prisma from "utils/prisma";
import sanitizeUser from "utils/sanitizeUser";
import { validateBody } from "../helpers";

export type CreateManyAbsencesDTO = {
  absences: {
    date: string;
    description?: string;
    reason: AbsenceReason;
    type: AbsenceType;
  }[];
  playerId: number;
};

export const expectedBody = Joi.object<CreateManyAbsencesDTO>({
  absences: Joi.array().items(AbsenceValidator).required(),
  playerId: Joi.number().required(),
});

const createManyAbsencesHandler = async (
  req: ValidatedNextApiRequest<CreateManyAbsencesDTO>,
  res: NextApiResponse
): Promise<void> => {
  let user: IUser;
  try {
    user = flattenUserRoles(await getAuthenticatedUser(req));
  } catch (err) {
    return res.status(401).json({ statusCode: 401, message: err.message });
  }

  let player: IPlayer;
  const { absences, playerId } = req.body;

  try {
    player = await getPlayerById(playerId);
  } catch (err) {
    return res.status(400).json({ statusCode: 400, message: err.message });
  }

  try {
    await prisma.$transaction(
      filterPlayerProfileAbsenceWrite(player, user, absences).map(
        ({ date, description, reason, type }) =>
          prisma.absence.create({
            data: {
              date,
              description,
              type,
              reason,
              users: {
                connect: {
                  id: playerId,
                },
              },
            },
          })
      )
    );
    const updatedPlayer = await prisma.user.findUnique({
      where: { id: playerId },
      include: {
        absences: true,
        profileFields: true,
        roles: true,
      },
    });
    if (!updatedPlayer) {
      throw new Error("Could not find player after saving new profile fields.");
    }

    return res.status(200).json({
      success: true,
      player: superjson.stringify(
        filterPlayerProfileRead(
          buildUserProfile(flattenUserRoles(sanitizeUser(updatedPlayer))),
          user
        )
      ),
    });
  } catch (err) {
    return res.status(500).json({ statusCode: 500, message: err.message });
  }
};

export default validateBody(createManyAbsencesHandler, expectedBody);
