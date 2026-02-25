import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/prisma";
//util de verificacion

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  //confirmacion de email y password
  //   emailAndPassword: {
  //     enabled: true,
  //   },
  //trusted Origins para permitir direcciones locales
  //   trustedOrigins: ["http://localhost:3000"],

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_SECRET_KEY!,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_SECRET_KEY!,
    },
  },
});
