import { AuthenticatedNextApiHandler, UserRoleType } from "interfaces";
import { NextApiRequest, NextApiResponse } from "next";

import flattenUserRoles from "utils/flattenUserRoles";
import getAuthenticatedUser from "utils/getAuthenticatedUser";

export const adminOnlyHandler = (
  handler: AuthenticatedNextApiHandler
) => async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  try {
    const user = await getAuthenticatedUser(req);
    if (flattenUserRoles(user).defaultRole?.type !== UserRoleType.Admin) {
      throw new Error(
        "You need to be logged in as an administrator to perform this function."
      );
    }
    handler(req, res, user);
  } catch (err) {
    res.statusCode = 500;
    res.json({ message: err.message });
  }
};

export default {
  adminOnlyHandler,
};
