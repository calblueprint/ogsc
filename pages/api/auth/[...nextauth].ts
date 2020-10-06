import NextAuth from "next-auth";
import Providers from "next-auth/providers";

type AuthorizeDTO = {
  email: string;
  password: string;
  inviteCode?: string;
  // metadata: userData;
}

const options = {
  // Configure one or more authentication providers
  providers: [
    Providers.Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Email", type: "text", placeholder: "" },
        password: {  label: "Password", type: "password" }
      },
      authorize: async (credentials: AuthorizeDTO) => {
        
        const user = users.findOne({ where: { email: credentials.email }});
        if (!user) {
            // Verify that they are specifying a valid invite code
            credentials.inviteCode
    
            // This is a new user, let's sign them up and authenticate them
            const newUser = user.create({
                    ...,
                    hashedPassword: hash(credentials.password)
            });
            return newUser; // TODO: Strip out hashedPassword
        }
        if (user.hashedPassword === hash(credentials.password)) {
            // This is an existing user, let's see if their password matches
            return user; // TODO: Strip out hashedPassword
        } else {
            // Password mismatch
            throw new Error('No!!!!!!');
        }
    }
    }
    }),
    // ...add more providers here
  ],

  // A database is optional, but required to persist accounts in a database
  database: process.env.DATABASE_URL,
};

export default (req, res) => NextAuth(req, res, options);
