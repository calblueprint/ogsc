/// <reference types="next" />
/// <reference types="next/types/global" />

import { PrismaClient } from "@prisma/client";

declare global {
  namespace NodeJS {
    interface Global {
      prisma: PrismaClient;
    }
  }
}
