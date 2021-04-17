import { UserRoleType } from "@prisma/client";
import { IPlayer } from "interfaces";
import buildUserProfile from "./buildUserProfile";
import flattenUserRoles from "./flattenUserRoles";
import prisma from "./prisma";

/**
 * Gets a built player user by ID.
 * @param playerId - User ID of the player to fetch
 * @throws If the user does not exist
 */
const getPlayerById = async (playerId: number): Promise<IPlayer> => {
  const playerUser = await prisma.user.findUnique({
    where: { id: playerId },
    include: {
      absences: true,
      profileFields: true,
      roles: true,
    },
  });
  if (!playerUser) {
    throw new Error("Could not find player with this ID.");
  }
  const player = buildUserProfile(flattenUserRoles(playerUser));
  if (player.defaultRole.type !== UserRoleType.Player) {
    throw new Error("This user is not a Player-type user.");
  }
  return player;
};

export default getPlayerById;
