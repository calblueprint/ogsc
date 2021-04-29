import { NoteType } from "@prisma/client";
import { ValidatedNextApiRequest } from "interfaces";
import Joi from "joi";
import { NextApiResponse } from "next";
import prisma from "utils/prisma";
import { validateBody } from "../helpers";

export type UpdateOneNoteDTO = {
  content: string;
  type: NoteType;
  authorId: number;
  playerId: number;
  noteId?: number;
};

const expectedBody = Joi.object<UpdateOneNoteDTO>({
  content: Joi.string(),
  type: Joi.valid(...Object.values(NoteType)),
  playerId: Joi.number(),
  authorId: Joi.number(),
  noteId: Joi.number(),
});

const updateOneNoteHandler = async (
  req: ValidatedNextApiRequest<UpdateOneNoteDTO>,
  res: NextApiResponse
): Promise<void> => {
  if (req.body.noteId) {
    try {
      await prisma.notes.update({
        where: { id: req.body.noteId },
        data: {
          content: req.body.content,
          type: req.body.type,
        },
      });
      return res.status(200).json({
        success: true,
      });
    } catch (err) {
      return res.status(500).json({ statusCode: 500, message: err.message });
    }
  }
  try {
    await prisma.notes.create({
      data: {
        content: req.body.content,
        type: req.body.type,
        player: {
          connect: {
            id: req.body.playerId,
          },
        },
        author: {
          connect: {
            id: req.body.authorId,
          },
        },
      },
    });
    return res.status(200).json({
      success: true,
    });
  } catch (err) {
    return res.status(500).json({ statusCode: 500, message: err.message });
  }
};

export default validateBody(updateOneNoteHandler, expectedBody);
