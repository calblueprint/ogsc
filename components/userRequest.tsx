// eslint-disable-next-line import/no-duplicates
import { PrismaClient } from "@prisma/client";
// eslint-disable-next-line import/no-duplicates
import { User } from "@prisma/client";

const prisma = new PrismaClient();

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default async function handle(res: { json: (arg0: User[]) => void }) {
  const AllInfo = await prisma.user.findMany();
  res.json(AllInfo);
}
