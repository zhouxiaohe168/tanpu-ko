import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  // Protected routes - redirect to login if no session token
  if (request.nextUrl.pathname.startsWith('/protected')) {
    const token = request.cookies.get('sb-access-token')
    if (!token) {
      const url = request.nextUrl.clone()
      url.pathname = '/auth/login'
      return NextResponse.redirect(url)
    }
  }
  return NextResponse.next({ request })
}
