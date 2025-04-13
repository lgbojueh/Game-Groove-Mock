// src/app/api/auth/[...nextauth]/route.ts
import NextAuth, { DefaultSession, NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

// Extend the NextAuth Session type to include the user id.
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

// Define authentication options.
export const authOptions: NextAuthOptions = {
  // Use the Prisma adapter for database integration.
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Ensure both email and password are provided.
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        // Find the user in your database by email.
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user) {
          throw new Error("No user found with this email");
        }

        // Compare the provided password with the stored hashed password.
        const isValidPassword = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isValidPassword) {
          throw new Error("Invalid password");
        }

        // Return the user object. Note: the id must be a string.
        return {
          id: user.id.toString(),
          name: user.username,
          email: user.email,
        };
      },
    }),
  ],
  session: {
    // Use JWT-based sessions.
    strategy: "jwt",
  },
  callbacks: {
    // Customize the session callback so that the session object includes the user id.
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub ?? "";
      }
      return session;
    },
    // Customize the JWT callback to attach the user id to the token during sign-in.
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
  // Use the secret for signing tokens.
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
