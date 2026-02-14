import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Definiera offentliga rutter
const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)']);

export default clerkMiddleware(async (auth, request) => {
  // Om rutten INTE är offentlig, vänta på auth och skydda sidan
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Hoppa över Next.js-filer och statiska filer
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Kör alltid för API-rutter
    '/(api|trpc)(.*)',
  ],
};
