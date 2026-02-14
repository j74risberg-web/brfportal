import { clerkMiddleware } from '@clerk/nextjs/server'

// Detta är den "default" export som loggen saknar
export default clerkMiddleware()

export const config = {
  matcher: [
    // Hoppa över Next.js interna filer och statiska filer (bilder, favicon etc)
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Kör alltid för API-rutter
    '/(api|trpc)(.*)',
  ],
}
