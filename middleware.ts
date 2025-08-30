import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define public routes that don't require authentication
const publicRoutes = [
  '/',
  '/find-makerspace',
  '/contact',
  '/makrverse',
  '/login',
  '/register',
  '/auth/callback',
  '/forgot-password',
];

// Define admin routes that require special permissions
const adminRoutes = [
  '/portal/admin',
  '/portal/system-health',
  '/portal/makerspaces',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if route is public
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );
  
  // Check if route is admin-only
  const isAdminRoute = adminRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  // Get authentication token from cookies or headers
  const authToken = request.cookies.get('auth-token')?.value || 
                   request.headers.get('authorization')?.replace('Bearer ', '');
  
  // Get user role from token (simplified - in real app, decode JWT)
  const userRole = request.cookies.get('user-role')?.value;
  
  // Allow public routes
  if (isPublicRoute) {
    return NextResponse.next();
  }
  
  // Redirect to login if no auth token for protected routes
  if (!authToken && !isPublicRoute) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  // Check admin permissions for admin routes
  if (isAdminRoute && userRole && !['super_admin', 'admin'].includes(userRole)) {
    const dashboardUrl = new URL('/portal/dashboard', request.url);
    return NextResponse.redirect(dashboardUrl);
  }
  
  // Add authentication headers for API requests
  if (pathname.startsWith('/api/') && authToken) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('authorization', `Bearer ${authToken}`);
    
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
