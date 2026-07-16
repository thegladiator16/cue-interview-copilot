import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signSession, setSessionCookie } from "@/lib/auth";

const STATE_COOKIE = "cue_oauth_state";

function loginError(origin: string, message: string) {
  const url = new URL("/login", origin);
  url.searchParams.set("error", message);
  return NextResponse.redirect(url);
}

export async function GET(req: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const origin = req.nextUrl.origin;

  if (!clientId || !clientSecret) {
    return loginError(origin, "Google sign-in isn't configured yet.");
  }

  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");
  const expectedState = req.cookies.get(STATE_COOKIE)?.value;

  if (!code || !state || !expectedState || state !== expectedState) {
    return loginError(origin, "Google sign-in failed — please try again.");
  }

  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        grant_type: "authorization_code",
        redirect_uri: `${origin}/api/auth/google/callback`,
      }),
    });

    if (!tokenRes.ok) {
      return loginError(origin, "Google sign-in failed — please try again.");
    }

    const tokenData = (await tokenRes.json()) as { access_token?: string };
    if (!tokenData.access_token) {
      return loginError(origin, "Google sign-in failed — please try again.");
    }

    const profileRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    if (!profileRes.ok) {
      return loginError(origin, "Couldn't read your Google profile — please try again.");
    }

    const profile = (await profileRes.json()) as {
      sub: string;
      email?: string;
      email_verified?: boolean;
      name?: string;
      picture?: string;
    };

    if (!profile.email || !profile.email_verified) {
      return loginError(origin, "Your Google account needs a verified email to sign in.");
    }

    let user = await prisma.user.findUnique({ where: { googleId: profile.sub } });

    if (!user) {
      user = await prisma.user.findUnique({ where: { email: profile.email } });
      if (user) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { googleId: profile.sub, avatarUrl: profile.picture },
        });
      } else {
        user = await prisma.user.create({
          data: {
            email: profile.email,
            name: profile.name ?? profile.email.split("@")[0],
            googleId: profile.sub,
            avatarUrl: profile.picture,
          },
        });
      }
    }

    const token = signSession({ userId: user.id });
    await setSessionCookie(token);

    const res = NextResponse.redirect(new URL("/dashboard", origin));
    res.cookies.delete(STATE_COOKIE);
    return res;
  } catch {
    return loginError(origin, "Google sign-in failed — please try again.");
  }
}
