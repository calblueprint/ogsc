import { NextApiRequest, NextApiResponse } from "next";
import prisma from "utils/prisma";

const deleteOneNoteHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const { id } = req.query;
  try {
    await prisma.notes.delete({
      where: { id: Number(id) },
    });
    return res.status(200).json({
      success: true,
    });
  } catch (err) {
    return res.status(500).json({ statusCode: 500, message: err.message });
  }
};

export default deleteOneNoteHandler;
