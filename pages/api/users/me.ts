import { IPlayer, IUser } from "interfaces";
import { NextApiRequest, NextApiResponse } from "next";
import buildUserProfile from "utils/buildUserProfile";
import flattenUserRoles from "utils/flattenUserRoles";
import getAuthenticatedUser from "utils/getAuthenticatedUser";
import sanitizeUser from "utils/sanitizeUser";
import { routeByMethod } from "../helpers";

export default routeByMethod({
  GET: async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    try {
      const user = await getAuthenticatedUser(req);
      const response: IUser | IPlayer = flattenUserRoles(
        sanitizeUser(buildUserProfile(user))
      );
      res.json(response);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
});
