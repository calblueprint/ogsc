import { ProfileFieldKey } from "@prisma/client";
import prisma from "utils/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import sanitizeUser from "utils/sanitizeUser";
import buildUserProfile, {
  deserializeProfileFieldValue,
} from "utils/buildUserProfile";
import { DEFAULT_PROFILE_PICTURE } from "../../../../constants";

export const getImageById = async (id: string): Promise<string> => {
  const userId = parseInt(id, 10);
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      profileFields: {
        where: {
          key: ProfileFieldKey.ProfilePicture,
        },
      },
    },
  });
  if (!user) {
    return DEFAULT_PROFILE_PICTURE;
  }
  const player = buildUserProfile(sanitizeUser(user));

  if (player) {
    const uploadedProfilePicture = deserializeProfileFieldValue(
      player.profile?.ProfilePicture?.current
    );
    if (uploadedProfilePicture) {
      return uploadedProfilePicture.key;
    }
  }
  return DEFAULT_PROFILE_PICTURE;
};

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const id = req.query.id as string;
  try {
    const userImage = await getImageById(id);
    if (userImage) {
      res.json({ userImage });
    } else {
      res
        .status(404)
        .json({ statusCode: 404, message: "Could not find image" });
    }
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
};

export default handler;
