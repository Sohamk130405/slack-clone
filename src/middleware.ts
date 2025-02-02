import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  isAuthenticatedNextjs,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";

const isPublicPage = createRouteMatcher(["/auth"]);
const isProtectedRoute = createRouteMatcher(["/(.*)"]);

export default convexAuthNextjsMiddleware(async (request) => {
  if (!isPublicPage(request) && !(await isAuthenticatedNextjs())) {
    return nextjsMiddlewareRedirect(request, "/auth");
  }
  if (isPublicPage(request) && (await isAuthenticatedNextjs())) {
    return nextjsMiddlewareRedirect(request, "/");
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
