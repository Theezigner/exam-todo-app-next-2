import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth";

const protectedPaths = ["/", "/todos"];
const authPages = ["/signin"];

export async function middleware(request: NextRequest) {
  const session = await auth();

  const { pathname } = request.nextUrl;

  const isProtectedPath = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );

  const isAuthPage = authPages.includes(pathname);

  if (isProtectedPath && !session) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  if (isAuthPage && session) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}
export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|signin).*)',
    ],
};
