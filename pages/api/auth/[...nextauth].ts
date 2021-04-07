import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import prisma from "utils/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import hashPassword from "utils/hashPassword";
import sanitizeUser from "utils/sanitizeUser";

export type AuthorizeDTO = {
  email: string;
  password: string;
  inviteCode?: string;
};

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
        const user = await prisma.user.findOne({
          where: { email: credentials.email },
        });
        if (!user) {
          return Promise.reject(new Error("No account exists"));
        }
        // Verify that their password matches
        if (user.hashedPassword === hashPassword(credentials.password)) {
          return Promise.resolve(sanitizeUser(user));
        }
        // Password mismatch
        return Promise.reject(
          new Error(`${"Invalid password&email="}${credentials.email}`)
        );
      },
    }),
  ],

  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/signin", // Error code passed in query string as ?error=
  },

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
