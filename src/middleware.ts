import { withAuth } from 'next-auth/middleware';

export default withAuth(
    function middleware(req) {
        // Add any custom middleware logic here
        return;
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                // Allow access to API routes and auth pages
                if (req.nextUrl.pathname.startsWith('/api') ||
                    req.nextUrl.pathname.startsWith('/auth')) {
                    return true;
                }

                // Require authentication for dashboard and mobile routes
                if (req.nextUrl.pathname.startsWith('/dashboard') ||
                    req.nextUrl.pathname.startsWith('/mobile')) {
                    return !!token;
                }

                return true;
            },
        },
    }
);

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/mobile/:path*',
        '/api/protected/:path*',
    ],
};