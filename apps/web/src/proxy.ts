import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";

interface AccessTokenPayload {
  sub: string;
  username: string;
  isOnboarded: boolean;
  iat: number;
  exp: number;
}

const AUTH_ROUTES = ["/signin", "/signup", "/forgot-password"];
const ONBOARDING_ROUTE = "/onboarding";
const PROTECTED_ROUTES = ["/dashboard", "/accounts"];

function verifyAndDecodeJwt(token: string): AccessTokenPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const [headerB64, payloadB64, signatureB64] = parts;

    const publicKeyBase64 = process.env.PUBLIC_KEY;

    if (!publicKeyBase64) return null;

    const publicKeyPem = Buffer.from(publicKeyBase64, "base64").toString(
      "ascii",
    );

    const isSignatureValid = crypto.verify(
      "RSA-SHA256",
      Buffer.from(`${headerB64}.${payloadB64}`),
      publicKeyPem,
      Buffer.from(signatureB64, "base64url"),
    );

    if (!isSignatureValid) return null;

    const payloadJson = Buffer.from(payloadB64, "base64url").toString("utf8");
    return JSON.parse(payloadJson) as AccessTokenPayload;
  } catch {
    return null;
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAuthRoute = AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
  const isOnboardingRoute =
    pathname === ONBOARDING_ROUTE ||
    pathname.startsWith(`${ONBOARDING_ROUTE}/`);
  const isProtectedRoute = PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  const rawToken = request.cookies.get("__Host-access_token")?.value;
  const user = rawToken ? verifyAndDecodeJwt(rawToken) : null;

  // 1. Unauthenticated user
  if (!user) {
    if (isProtectedRoute || isOnboardingRoute) {
      return NextResponse.redirect(new URL("/signin", request.url));
    }
    return NextResponse.next();
  }

  // 2. Authenticated, but NOT onboarded yet
  if (!user.isOnboarded) {
    if (isOnboardingRoute) {
      return NextResponse.next();
    }
    if (isProtectedRoute || isAuthRoute) {
      return NextResponse.redirect(new URL(ONBOARDING_ROUTE, request.url));
    }
    return NextResponse.next();
  }

  // 3. Authenticated AND onboarded
  if (isOnboardingRoute || isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
