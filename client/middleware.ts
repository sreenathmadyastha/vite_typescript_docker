// middleware.ts
import { NextResponse, NextRequest } from 'next/server'
import type { NextRequest as NextRequestType } from 'next/server'

// Helper to determine MIME type from file extension (unchanged)
function getContentTypeFromExtension(pathname: string): string {
  const ext = pathname.split('.').pop()?.toLowerCase() || ''
  const mimeTypes: Record<string, string> = {
    // Images
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    gif: 'image/gif',
    webp: 'image/webp',
    svg: 'image/svg+xml',
    ico: 'image/x-icon',
    // Documents
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    txt: 'text/plain',
    // Styles/Scripts
    css: 'text/css',
    js: 'application/javascript',
    json: 'application/json',
    // Others
    html: 'text/html',
    xml: 'application/xml',
    zip: 'application/zip',
    mp4: 'video/mp4',
    // Fallback (customize for pages, e.g., to 'text/html')
    default: 'application/octet-stream',
  }
  return mimeTypes[ext] || mimeTypes.default
}

// Updated helper: Remove 'insights' ONLY if at the beginning (leading segment)
function omitInsightsFromPath(pathname: string): string {
  return pathname.replace(/^\/insights(\/|$)/, '/')
  // e.g., /insights → /, /insights/foo → /foo
  // But /foo/insights/bar → /foo/insights/bar (no change)
}

export function middleware(request: NextRequestType) {
  const { pathname } = request.nextUrl

  // Validation: Require 'insights' anywhere in path
  if (!pathname.includes('insights')) {
    const errorResponse = new NextResponse('Not Found: Insights not requested', { 
      status: 404 
    })
    errorResponse.headers.set('Content-Type', 'text/plain; charset=utf-8')
    return errorResponse
  }

  // Rewrite URL by omitting 'insights' (only if leading)
  const rewrittenPathname = omitInsightsFromPath(pathname)
  const rewrittenUrl = new URL(rewrittenPathname, request.url)
  request.nextUrl.pathname = rewrittenPathname  // Update request for downstream

  // Determine Content-Type based on (rewritten) extension
  const contentType = getContentTypeFromExtension(rewrittenPathname)

  // Create response and set headers
  const response = NextResponse.rewrite(rewrittenUrl)  // Internal rewrite: browser URL unchanged
  response.headers.set('Content-Type', contentType)
  
  // Optional: Cache headers based on type
  if (contentType.startsWith('image/') || contentType.startsWith('application/')) {
    response.headers.set('Cache-Control', 'public, max-age=31536000')  // 1 year for assets
  } else {
    response.headers.set('Cache-Control', 'no-cache')  // No cache for dynamic pages
  }

  return response
}

// Matcher: Apply broadly, excluding statics/APIs
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}