// app/services/auth.server.ts
import { User } from "@prisma/client";
import { Authenticator } from "remix-auth";
import { TOTPStrategy } from "remix-auth-totp";
import { sessionStorage } from "~/services/session.server";
import { sendAuthEmail } from "./email.server";
import { prisma } from "~/prisma.server";

export const authenticator = new Authenticator<User>(sessionStorage, {
throwOnError: true,
})

authenticator.use(
  new TOTPStrategy(
      {
        secret: process.env.ENCRYPTION_SECRET!,
        magicLinkPath: '/magic-link',
        sendTOTP: async ({ email, code, magicLink }) => {
          if (process.env.NODE_ENV === 'development') {
            console.log('[Dev-Only] TOTP Code:', code)
          }
          await sendAuthEmail({ email, code, magicLink })
        },
      },
      async ({ email }) => {
        let user = await prisma.user.findUnique({ where: { email } })
  
        if (!user) {
          user = await prisma.user.create({ data: { email } })
          if (!user) throw new Error('Whoops! Unable to create user.')
        }
  
        return user
      },
    ),
  )