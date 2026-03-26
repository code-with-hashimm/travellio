import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET(
  request: NextRequest,
  { params }: { params: { runId: string } }
) {
  const runId = params.runId

  if (!process.env.TINYFISH_API_KEY) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
  }

  try {
    const url = `${process.env.TINYFISH_BASE_URL}/runs/${runId}`

    const res = await fetch(url, {
      headers: {
        'X-API-Key': process.env.TINYFISH_API_KEY,
      },
      next: { revalidate: 0 } 
    })

    if (!res.ok) {
       const text = await res.text()
       return NextResponse.json({ error: `TinyFish API error: ${text}` }, { status: res.status })
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (err) {
    console.error('[Proxy] Status Error:', err)
    return NextResponse.json({ error: 'Failed to fetch status' }, { status: 502 })
  }
}
