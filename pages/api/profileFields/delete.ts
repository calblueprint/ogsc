import { ProfileField } from "@prisma/client";
import { IPlayer, IUser } from "interfaces";
import { NextApiRequest, NextApiResponse } from "next";
import buildUserProfile from "utils/buildUserProfile";
import filterPlayerProfileWrite from "utils/filterPlayerProfileWrite";
import flattenUserRoles from "utils/flattenUserRoles";
import getAuthenticatedUser from "utils/getAuthenticatedUser";
import prisma from "utils/prisma";

const deleteOneProfileFieldHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  let user: IUser;
  try {
    user = flattenUserRoles(await getAuthenticatedUser(req));
  } catch (err) {
    return res.status(401).json({ statusCode: 401, message: err.message });
  }

  const { id } = req.query;
  let field: ProfileField | null;
  try {
    field = await prisma.profileField.findUnique({ where: { id: Number(id) } });
    if (!field) {
      throw new Error("ProfileField not found");
    }
  } catch (err) {
    return res.status(404).json({
      statusCode: 404,
      message: "Could not find ProfileField to delete.",
    });
  }

  let player: IPlayer | null;
  try {
    const playerUser = await prisma.user.findUnique({
      where: { id: field.userId },
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
      message: "ProfileField belongs to a player that does not exist.",
    });
  }

  const updates = filterPlayerProfileWrite(player, user, [{ key: field.key }]);
  if (updates.length === 0) {
    return res.status(401).json({
      statusCode: 401,
      message: "Not allowed to delete this ProfileField.",
    });
  }

  try {
    await prisma.profileField.delete({
      where: { id: Number(id) },
    });
    return res.status(200).json({
      success: true,
    });
  } catch (err) {
    return res.status(500).json({ statusCode: 500, message: err.message });
  }
};

export default deleteOneProfileFieldHandler;
