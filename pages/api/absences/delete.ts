import { Absence } from "@prisma/client";
import { IPlayer, IUser } from "interfaces";
import { NextApiRequest, NextApiResponse } from "next";
import buildUserProfile from "utils/buildUserProfile";
import { filterPlayerProfileAbsenceWrite } from "utils/filterPlayerProfileWrite";
import flattenUserRoles from "utils/flattenUserRoles";
import getAuthenticatedUser from "utils/getAuthenticatedUser";
import prisma from "utils/prisma";

const deleteOneAbsenceHandler = async (
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
  let absence: Absence | null;
  try {
    absence = await prisma.absence.findUnique({ where: { id: Number(id) } });
    if (!absence) {
      throw new Error("Absence not found");
    }
  } catch (err) {
    return res.status(404).json({
      statusCode: 404,
      message: "Could not find Absence to delete.",
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

  const updates = filterPlayerProfileAbsenceWrite(player, user, [absence]);
  if (updates.length === 0) {
    return res.status(401).json({
      statusCode: 401,
      message: "Not allowed to delete this Absence.",
    });
  }

  try {
    await prisma.absence.delete({
      where: { id: Number(id) },
    });
    return res.status(200).json({
      success: true,
    });
  } catch (err) {
    return res.status(500).json({ statusCode: 500, message: err.message });
  }
};

export default deleteOneAbsenceHandler;
