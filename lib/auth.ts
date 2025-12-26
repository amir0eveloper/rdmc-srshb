/* eslint-disable @typescript-eslint/no-explicit-any */
// /lib/auth.ts
import NextAuth, { type NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "./prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { Role } from "@prisma/client";

// Helper function to fetch user by username
export const getUserWithUsername = async (username: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { username },
    });
    return user;
  } catch (error) {
    console.error("Error fetching user with username:", error);
    return null;
  }
};

// Extend NextAuth types to include custom user properties
declare module "next-auth" {
  interface User {
    username?: string | null;
    role: Role;
  }
  interface Session {
    user: {
      id: string;
      username?: string | null;
      role: Role;
      email?: string | null;
      name?: string | null;
      image?: string | null;
    };
  }
}

export const config = {
  trustHost: true,
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

        const user = await getUserWithUsername(credentials.username as string);

        if (
          !user ||
          !user.hashedPassword ||
          !(await compare(credentials.password as string, user.hashedPassword))
        ) {
          return null;
        }

        return {
          id: user.id,
          username: user.username,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        (token as any).id = user.id;
        (token as any).role = user.role;
        (token as any).username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = (token as any).id;
        session.user.role = (token as any).role;
        session.user.username = (token as any).username;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 60, // 30 minutes
    updateAge: 15 * 60, // refresh token every 15 mins if user is active
  },
  pages: {
    signIn: "/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
