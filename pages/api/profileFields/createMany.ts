import { PrismaClient, ProfileFieldKey, UserRoleType } from "@prisma/client";
import {
  IPlayer,
  IUser,
  ProfileFieldValues,
  ValidatedNextApiRequest,
} from "interfaces";
import Joi from "joi";
import { ProfileFieldValueValidators } from "lib/validate";
import { NextApiResponse } from "next";
import superjson from "superjson";
import buildUserProfile from "utils/buildUserProfile";
import filterPlayerProfileRead from "utils/filterPlayerProfileRead";
import filterPlayerProfileWrite from "utils/filterPlayerProfileWrite";
import flattenUserRoles from "utils/flattenUserRoles";
import getAuthenticatedUser from "utils/getAuthenticatedUser";
import sanitizeUser from "utils/sanitizeUser";
import { validateBody } from "../helpers";

type CreateManyProfileFieldsDTO = {
  fields: {
    key: ProfileFieldKey;
    value: string;
  }[];
  playerId: number;
};

const prisma = new PrismaClient();

const expectedBody = Joi.object<CreateManyProfileFieldsDTO>({
  fields: Joi.array()
    .items(
      Joi.object({
        key: Joi.string()
          .valid(...Object.keys(ProfileFieldKey))
          .required(),
        value: Joi.string().required(),
      })
    )
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
    const playerUser = await prisma.user.findUnique({
      where: { id: playerId },
      include: {
        absences: true,
        profileFields: true,
        roles: true,
      },
    });
    if (!playerUser) {
      throw new Error("Could not find player to add new fields to.");
    }
    player = buildUserProfile(flattenUserRoles(playerUser));
    if (player.defaultRole.type !== UserRoleType.Player) {
      throw new Error("Could not add new fields to non-player type user.");
    }
    const expectedProfileFieldValues = Joi.object({
      fields: Joi.array().items(
        ...fields.map(({ key }: { key: ProfileFieldKey; value: string }) =>
          Joi.object({
            value: ProfileFieldValueValidators[ProfileFieldValues[key]],
          })
        )
      ),
    });
    const values = expectedProfileFieldValues.validate(req.body, {
      allowUnknown: true,
    });
    if (values.error) {
      throw values.error;
    }
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ statusCode: 400, error: err });
    }
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

export default validateBody(createManyProfileFieldsHandler, expectedBody);
