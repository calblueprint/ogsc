import { Notes, Prisma } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "utils/prisma";

export type ReadManyNotesDTO = {
  notes: Notes[];
};

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const search = req.query.search as string | undefined;
  const id = req.query.id as string;
  try {
    const filterArgs: Prisma.FindManyNotesArgs = {
      where: {
        ...(search
          ? {
              content: {
                contains: search,
                mode: "insensitive",
              },
              playerId: {
                equals: parseInt(id, 10),
              },
            }
          : {
              playerId: {
                equals: parseInt(id, 10),
              },
            }),
      },
    };

    const notes = await prisma.notes.findMany({
      ...filterArgs,
    });

    if (!notes) {
      res.status(404).json({
        statusCode: 404,
        message: "That note does not exist.",
      });
    } else {
      res.json({
        notes,
      } as ReadManyNotesDTO);
    }
  } catch (err) {
    res.status(500);
    res.json({ statusCode: 500, message: err.message });
  }
};
