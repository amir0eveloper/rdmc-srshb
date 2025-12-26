/* eslint-disable @typescript-eslint/no-explicit-any */
// /lib/auth.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "./prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { Role } from "@prisma/client";
import { authConfig } from "./auth.config";

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

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
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
});
