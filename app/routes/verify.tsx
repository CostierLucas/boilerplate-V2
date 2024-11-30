import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { authenticator } from "~/services/auth.server";
import { commitSession, getSession } from "~/services/session.server";
import CardVerify from "~/sections/auth/card-verify";

export async function loader({ request }: LoaderFunctionArgs) {
  await authenticator.isAuthenticated(request, {
    successRedirect: "/account",
  });

  const cookie = await getSession(request.headers.get("cookie"));
  const authEmail = cookie.get("auth:email");
  const authError = cookie.get(authenticator.sessionErrorKey);

  if (!authEmail) return redirect("/login");

  // Commit session to clear any `flash` error message.
  return json({ authEmail, authError } as const, {
    headers: {
      "set-cookie": await commitSession(cookie),
    },
  });
}

export default function Verify() {
  return (
    <div className="flex justify-center items-center h-screen flex-col">
      <CardVerify />
    </div>
  );
}
