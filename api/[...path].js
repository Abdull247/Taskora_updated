export const config = {
  runtime: 'edge',
}

const BACKEND_URL = 'https://taskora-backend-qe5r.onrender.com'

export default async function handler(request) {
  const url = new URL(request.url)
  const path = url.pathname.replace(/^\/api/, '')
  const targetUrl = `${BACKEND_URL}${path}${url.search}`

  const headers = new Headers()
  const contentType = request.headers.get('content-type')
  if (contentType) headers.set('content-type', contentType)
  const authorization = request.headers.get('authorization')
  if (authorization) headers.set('authorization', authorization)

  try {
    const backendResponse = await fetch(targetUrl, {
      method: request.method,
      headers,
      body: ['GET', 'HEAD'].includes(request.method) ? undefined : await request.text(),
    })

    const responseBody = await backendResponse.text()

    return new Response(responseBody, {
      status: backendResponse.status,
      headers: {
        'content-type': backendResponse.headers.get('content-type') || 'application/json',
      },
    })
  } catch (err) {
    return new Response(
      JSON.stringify({ error: 'Failed to reach backend', detail: String(err) }),
      {
        status: 502,
        headers: { 'content-type': 'application/json' },
      }
    )
  }
}
