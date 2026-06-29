import { clerkMiddleware,createRouteMatcher} from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/analytics(.*)',
  "/api/shipping/cotizar",
  "/api/shipping/ordenes",
  "/api/seller/[id_vendedor]/ordenes/[id_orden]/preparar",
  "/api/shipping/ordenes/[id_orden]/retirado",
  "/api/notificaciones",
    "/api/shipping/[trackingId]"
])

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = { matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'], }