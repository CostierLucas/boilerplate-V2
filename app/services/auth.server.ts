// app/services/auth.server.ts
import { User } from "@prisma/client";
import { Authenticator } from "remix-auth";
import { TOTPStrategy } from "remix-auth-totp";
import { GoogleStrategy } from "remix-auth-google";
import { sessionStorage } from "~/services/session.server";
import { sendAuthEmail } from "./email.server";
import { prisma } from "~/prisma.server";

export const authenticator = new Authenticator<User>(sessionStorage, {
  throwOnError: true,
});

authenticator.use(
  new TOTPStrategy(
    {
      secret: process.env.ENCRYPTION_SECRET!,
      magicLinkPath: "/magic-link",
      sendTOTP: async ({ email, code, magicLink }) => {
        await sendAuthEmail({ email, code, magicLink });
      },
    },
    async ({ email }) => {
      let user = await prisma.user.findUnique({ where: { email } });

      if (!user) {
        user = await prisma.user.create({ data: { email } });
        if (!user) throw new Error("Whoops! Unable to create user.");
      }

      return user;
    }
  )
);

authenticator.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: `${process.env.APP_URL}/auth/google/callback`,
    },
    async ({ profile }) => {
      let user = await prisma.user.findUnique({
        where: { email: profile.emails[0].value },
      });

      if (!user) {
        user = await prisma.user.create({
          data: { email: profile.emails[0].value },
        });
        if (!user) throw new Error("Whoops! Unable to create user.");
      }

      return user;
    }
  )
);
