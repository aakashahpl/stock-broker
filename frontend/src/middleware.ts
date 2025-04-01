import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  // ✅ Read HttpOnly cookie directly from the request
  const userToken = req.cookies.get("authorization")?.value;

  console.log("Middleware - Authorization Cookie:", userToken);

  if (!userToken) {
    return NextResponse.redirect(new URL("/", req.url)); // Redirect if no auth token
  }

  // Proceed normally if the user is authenticated
  return NextResponse.next();
}

// ✅ Apply middleware to protected routes
export const config = {
  matcher: ["/explore", "/stock/:slug*", "/investments"],
};
