import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import hashPassword from "utils/hashPassword";
import sanitizeUser from "utils/sanitizeUser";

type AuthorizeDTO = {
  email: string;
  password: string;
  inviteCode?: string;
};

const prisma = new PrismaClient();

const options = {
  // Configure one or more authentication providers
  providers: [
    Providers.Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials: AuthorizeDTO) => {
        const user = await prisma.user.findFirst({
          where: { email: credentials.email },
        });
        if (!user) {
          // This is a new user, let's sign them up and authenticate them
          // call createAccount endpoint
          // const newUser = await prisma.user.create({
          //   data: {
          //     email: credentials.email,
          //     hashedPassword: hashPassword(credentials.password),
          //   },
          // });
          // return sanitizeUser(newUser);
        }
        // Verify that they are specifying a valid invite code
        if (user.hashedPassword === hashPassword(credentials.password)) {
          // This is an existing user, let's see if their password matches
          return sanitizeUser(user);
        }
        // Password mismatch
        throw new Error("Invalid password");
      },
    }),
  ],

  database: process.env.DATABASE_URL,
  session: {
    jwt: true,
  },
  jwt: {
    secret: process.env.JWT_SIGNING_PRIVATE_KEY,
  },
};

export default (
  req: NextApiRequest,
  res: NextApiResponse<unknown>
): Promise<void> => NextAuth(req, res, options);
