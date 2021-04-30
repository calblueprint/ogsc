import { ProfileFieldKey } from "@prisma/client";
import { IPlayer, IUser, ValidatedNextApiRequest } from "interfaces";
import Joi from "joi";
import { NextApiResponse } from "next";
import superjson from "superjson";
import buildUserProfile from "utils/buildUserProfile";
import filterPlayerProfileRead from "utils/filterPlayerProfileRead";
import filterPlayerProfileWrite from "utils/filterPlayerProfileWrite";
import flattenUserRoles from "utils/flattenUserRoles";
import getAuthenticatedUser from "utils/getAuthenticatedUser";
import getPlayerById from "utils/getPlayerById";
import prisma from "utils/prisma";
import sanitizeUser from "utils/sanitizeUser";
import validateProfileField from "utils/validateProfileField";
import { validateBody } from "../helpers";

export type CreateManyProfileFieldsDTO = {
  fields: {
    key: ProfileFieldKey;
    value: string;
  }[];
  playerId: number;
};

export const expectedBody = Joi.object<CreateManyProfileFieldsDTO>({
  fields: Joi.array()
    .items(
      Joi.object({
        key: Joi.string()
          .valid(...Object.keys(ProfileFieldKey))
          .required(),
        value: Joi.string().required(),
      })
        .custom((value: { key: ProfileFieldKey; value: string }) => {
          const checkFieldValue = validateProfileField(value.value, value.key);
          if (checkFieldValue.error) {
            throw checkFieldValue.error;
          }
          return value;
        })
        .message("{{#error.message}}")
    )
    .options({ abortEarly: false })
    .required(),
  playerId: Joi.number().required(),
});

const createManyProfileFieldsHandler = async (
  req: ValidatedNextApiRequest<CreateManyProfileFieldsDTO>,
  res: NextApiResponse
): Promise<void> => {
  let user: IUser;
  try {
    user = flattenUserRoles(await getAuthenticatedUser(req));
  } catch (err) {
    return res.status(401).json({ statusCode: 401, message: err.message });
  }

  let player: IPlayer;
  const { fields, playerId } = req.body;

  try {
    player = await getPlayerById(playerId);
  } catch (err) {
    return res.status(400).json({ statusCode: 400, message: err.message });
  }

  try {
    await prisma.$transaction(
      filterPlayerProfileWrite(player, user, fields).map(
        ({ key, value }: { key: ProfileFieldKey; value: string }) =>
          prisma.profileField.create({
            data: {
              key,
              user: {
                connect: {
                  id: playerId,
                },
              },
              value,
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

export default validateBody(
  createManyProfileFieldsHandler,
  expectedBody,
  (error: string) => `Could not save the Player Profile: ${error}`
);
