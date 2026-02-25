import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const response = NextResponse.next();

  // Check if the sidebar_state cookie exists
  if (!request.cookies.has("sidebar_state")) {
    // Set the default cookie
    response.cookies.set("sidebar_state", "true", {
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
  }

  // Check if the sidebar_variant cookie exists
  if (!request.cookies.has("sidebar_variant")) {
    // Set the default cookie
    response.cookies.set("sidebar_variant", "inset", {
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
  }

  // Check if the chat_widget_state cookie exists
  if (!request.cookies.has("chat_widget_state")) {
    // Set the default cookie
    response.cookies.set("chat_widget_state", "open", {
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
  }

  // Check if the chat_widget_position cookie exists
  if (!request.cookies.has("chat_widget_position")) {
    // Set the default cookie
    response.cookies.set("chat_widget_position", "bottom-right", {
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
  }

  return response;
}

// Run proxy on all routes
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
