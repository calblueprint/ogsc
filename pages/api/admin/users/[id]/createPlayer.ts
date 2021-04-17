import { ProfileFieldKey } from "@prisma/client";
import { IPlayer, IUser, ValidatedNextApiRequest } from "interfaces";
import Joi from "joi";
import { NextApiResponse } from "next";
import {
  CreateManyAbsencesDTO,
  expectedBody as CreateManyAbsencesValidator,
} from "pages/api/absences/createMany";
import { routeByMethod, validateBody } from "pages/api/helpers";
import {
  CreateManyProfileFieldsDTO,
  expectedBody as CreateManyProfileFieldsValidator,
} from "pages/api/profileFields/createMany";
import buildUserProfile from "utils/buildUserProfile";
import filterPlayerProfileRead from "utils/filterPlayerProfileRead";
import filterPlayerProfileWrite, {
  filterPlayerProfileAbsenceWrite,
} from "utils/filterPlayerProfileWrite";
import flattenUserRoles from "utils/flattenUserRoles";
import getAuthenticatedUser from "utils/getAuthenticatedUser";
import getPlayerById from "utils/getPlayerById";
import prisma from "utils/prisma";
import sanitizeUser from "utils/sanitizeUser";
import { adminOnlyHandler } from "../../helpers";

export type CreatePlayerProfileForUserDTO = {
  profileFields: CreateManyProfileFieldsDTO;
  absences: CreateManyAbsencesDTO;
};

const expectedBody = Joi.object<CreatePlayerProfileForUserDTO>({
  profileFields: CreateManyProfileFieldsValidator,
  absences: CreateManyAbsencesValidator,
});

const createPlayerProfileForUserHandler = async (
  req: ValidatedNextApiRequest<CreatePlayerProfileForUserDTO>,
  res: NextApiResponse
): Promise<void> => {
  const { profileFields, absences } = req.body;
  const { id: playerId } = req.query;
  let user: IUser;
  try {
    user = flattenUserRoles(await getAuthenticatedUser(req));
  } catch (err) {
    return res.status(401).json({ statusCode: 401, message: err.message });
  }
  let player: IPlayer;
  try {
    player = await getPlayerById(Number(playerId));
  } catch (err) {
    return res.status(400).json({ statusCode: 400, message: err.message });
  }

  try {
    await prisma.$transaction<unknown>([
      ...filterPlayerProfileWrite(player, user, profileFields.fields).map(
        ({ key, value }: { key: ProfileFieldKey; value: string }) =>
          prisma.profileField.create({
            data: {
              key,
              user: {
                connect: {
                  id: player.id,
                },
              },
              value,
            },
          })
      ),
      ...filterPlayerProfileAbsenceWrite(player, user, absences.absences).map(
        ({ date, description, reason, type }) =>
          prisma.absence.create({
            data: {
              date,
              description,
              type,
              reason,
              users: {
                connect: {
                  id: player.id,
                },
              },
            },
          })
      ),
    ]);
    const updatedPlayer = await prisma.user.findUnique({
      where: { id: player.id },
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
      player: filterPlayerProfileRead(
        buildUserProfile(flattenUserRoles(sanitizeUser(updatedPlayer))),
        user
      ),
    });
  } catch (err) {
    return res.status(500).json({ statusCode: 500, message: err.message });
  }
};

export default adminOnlyHandler(
  routeByMethod({
    POST: validateBody(createPlayerProfileForUserHandler, expectedBody),
  })
);
