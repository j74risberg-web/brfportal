import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Här definierar vi rutter som SKA vara offentliga (t.ex. själva inloggningssidan)
const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)']);

export default clerkMiddleware((auth, request) => {
  // Om rutten INTE är offentlig, tvinga användaren att logga in
  if (!isPublicRoute(request)) {
    auth().protect();
  }
});

export const config = {
  matcher: [
    // Hoppa över interna Next.js-filer och statiska filer
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Kör alltid för API-rutter
    '/(api|trpc)(.*)',
  ],
};
