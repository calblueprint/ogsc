import { NextApiRequest, NextApiResponse } from "next";
import { adminOnlyHandler } from "./helpers";

const handler = async (
  _req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  res.json({ ok: true });
};

export default adminOnlyHandler(handler);
