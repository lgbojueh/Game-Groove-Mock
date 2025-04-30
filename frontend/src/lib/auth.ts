import { NextAuthOptions, DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

// Extend Session and User
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
    } & DefaultSession["user"];
  }
  interface User {
    id: string;
    username?: string | null;
    email: string;
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          // missing fields
          throw new Error("Please enter both email and password.");
        }

        // Normalize email to lowercase and trim whitespace
        const normalizedEmail = credentials.email.trim().toLowerCase();

        // Find user case-insensitively
        const user = await prisma.user.findFirst({
          where: {
            email: { equals: normalizedEmail, mode: "insensitive" },
            isActive: true,
          },
        });

        if (!user) {
          // no account with that email
          throw new Error("Email not found. Please sign up.");
        }

        if (!user.password) {
          // user exists but no password set (e.g. OAuth)
          throw new Error("No local login available. Please sign up or use another sign-in method.");
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isValid) {
          // password incorrect
          throw new Error("Incorrect email or password.");
        }

        return {
          id: user.id.toString(),
          name: user.username ?? user.email,
          email: user.email,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};
