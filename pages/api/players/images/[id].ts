import { ProfileFieldKey } from "@prisma/client";
import prisma from "utils/prisma";
// import { IPlayer } from "interfaces";
// import Joi from "lib/validate";
import { NextApiRequest, NextApiResponse } from "next";
import sanitizeUser from "utils/sanitizeUser";
import buildUserProfile, {
  deserializeProfileFieldValue,
} from "utils/buildUserProfile";
import { DEFAULT_PROFILE_PICTURE } from "../../../../constants";

export const getImageById = async (id: string): Promise<string> => {
  // if (Joi.string().uuid({ version: "uuidv4" }).validate(id).error) {
  //   return DEFAULT_PROFILE_PICTURE;
  // }
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
      const response = await fetch(
        `/api/profilePicture?key=${uploadedProfilePicture.key}`,
        {
          method: "GET",
          headers: { "content-type": "application/json" },
          redirect: "follow",
        }
      );
      if (response.ok) {
        return (await response.json()).url;
      }
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
    // console.log(id);
    const userImage = await getImageById(id);
    if (userImage) {
      res.status(200).json(userImage);
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
