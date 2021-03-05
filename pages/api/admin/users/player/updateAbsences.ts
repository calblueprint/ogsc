import { PrismaClient, AbsenceCreateWithoutUsersInput } from "@prisma/client";
import { ValidatedNextApiRequest } from "interfaces";
import Joi from "lib/validate";
import { NextApiResponse } from "next";
import { validateBody } from "pages/api/helpers";
import sanitizeUser from "utils/sanitizeUser";
import type { AbsenceFormValues } from "pages/admin/players/playerForm/attendence";
import { adminOnlyHandler } from "../../helpers";

const prisma = new PrismaClient();

export type PlayerUserDTO = {
  id: number;
};

const expectedBody = Joi.object<AbsenceFormValues & PlayerUserDTO>({
  id: Joi.number().required(),
  schoolAbsences: Joi.array().items(Joi.string()).optional().allow(null),
  academicAbsences: Joi.array().items(Joi.string()).optional().allow(null),
  athleticAbsences: Joi.array().items(Joi.string()).optional().allow(null),
});

const handler = async (
  req: ValidatedNextApiRequest<AbsenceFormValues & PlayerUserDTO>,
  res: NextApiResponse
): Promise<void> => {
  try {
    const absenceProfileFields: AbsenceCreateWithoutUsersInput[] = [];
    const userAbsenceInfo = req.body;
    Object.keys(userAbsenceInfo).forEach((key) => {
      if (key === "schoolAbsences") {
        userAbsenceInfo[key].forEach((value) => {
          const date = new Date(value.split(" - ")[0]);
          const reason =
            value.split(" - ")[1] === "Excused" ? "Excused" : "Unexcused";
          const description = value.split(" - ")[2];
          absenceProfileFields.push({
            type: "School",
            date,
            description,
            reason,
          });
        });
      } else if (key === "academicAbsences") {
        userAbsenceInfo[key].forEach((value) => {
          const date = new Date(value.split(" - ")[0]);
          const reason =
            value.split(" - ")[1] === "Excused" ? "Excused" : "Unexcused";
          const description = value.split(" - ")[2];
          absenceProfileFields.push({
            type: "Academic",
            date,
            description,
            reason,
          });
        });
      } else if (key === "athleticAbsences") {
        userAbsenceInfo[key].forEach((value) => {
          const date = new Date(value.split(" - ")[0]);
          const reason =
            value.split(" - ")[1] === "Excused" ? "Excused" : "Unexcused";
          const description = value.split(" - ")[2];
          absenceProfileFields.push({
            type: "Athletic",
            date,
            description,
            reason,
          });
        });
      }
    });
    const user = await prisma.user.update({
      where: { id: userAbsenceInfo.id || Number(req.query.id) },
      data: {
        absences: { create: absenceProfileFields },
      },
    });
    if (!user) {
      res
        .status(404)
        .json({ statusCode: 404, message: "User does not exist." });
    }
    res.json({
      message: "Successfully updated user.",
      user: sanitizeUser(user),
    });
  } catch (err) {
    res.status(500);
    res.json({ statusCode: 500, message: err.message });
  }
};

export default validateBody(adminOnlyHandler(handler), expectedBody);
