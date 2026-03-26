import { NextRequest } from 'next/server'
import { getSiteConfig, buildSelectorHints, SITE_CONFIG } from '@/lib/siteConfig'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function POST(request: NextRequest) {

  // 1. Read and validate search params from request body
  const body = await request.json()
  const { type, from, to, date, adults, cabinClass } = body

  console.log('API route received:', {
    type, from, to, date, adults, cabinClass
  })

  const missing = []
  if (!type) missing.push('type')
  if (!from) missing.push('from')
  if (!to) missing.push('to')
  if (!date) missing.push('date')

  if (missing.length > 0) {
    return new Response(
      JSON.stringify({
        error: 'Missing required search parameters',
        missing: missing,
      }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }

  if (!process.env.TINYFISH_API_KEY) {
    return new Response(
      JSON.stringify({ error: 'API key not configured' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }

  // 2. Build the start URL (deep-link fast-track)
  const startUrl = buildStartUrl(type, from, to, date, adults, cabinClass)

  // 3. Build the goal string, injecting Fast-Track selector hints if the site is known
  const siteProfile = getSiteConfig(startUrl)
  const selectorHints = siteProfile ? buildSelectorHints(siteProfile) : ''
  const goal = buildGoal(type, from, to, date, adults, cabinClass) + selectorHints

  // 4. Call TinyFish /run-sse
  let tinyfishResponse: Response

  try {
    tinyfishResponse = await fetch(
      `${process.env.TINYFISH_BASE_URL}/automation/run-sse`,
      {
        method: 'POST',
        headers: {
          'X-API-Key': process.env.TINYFISH_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: startUrl,
          goal: goal,
        }),
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to connect to AI agent' }),
      { status: 502, headers: { 'Content-Type': 'application/json' } }
    )
  }

  if (!tinyfishResponse.ok) {
    const errorText = await tinyfishResponse.text()

    if (tinyfishResponse.status === 401) {
      return new Response(
        JSON.stringify({ error: 'Invalid API key' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }

    if (tinyfishResponse.status === 429) {
      return new Response(
        JSON.stringify({ error: 'Rate limit reached. Please wait.' }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Agent service error', detail: errorText }),
      {
        status: tinyfishResponse.status,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }

  // 5. Stream the TinyFish SSE response directly back to the browser
  return new Response(tinyfishResponse.body, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  })
}


// ─── Goal builder ────────────────────────────────────────────────

function buildGoal(
  type: string,
  from: string,
  to: string,
  date: string,
  adults: string = '1',
  cabinClass: string = 'economy'
): string {

  switch (type) {
    case 'flights':
      return `You are a deal-hunting agent. Find one-way flights from ${from} to ${to} on ${date} for ${adults} adult(s).
              For EVERY flight found, immediately emit its data: DATA: {"airline": "...", "price": 0, "duration": "...", "stops": 0}.
              Return top 8 as JSON with key "flights".
              After loading the results, your primary goal is to find the CHEAPEST 3 options. Look for the lowest price tags on the page. Only return these top 3 cheapest deals in your JSON output. If there is a 'Cheapest' sort button on the website, click it first.`

    case 'trains':
      return `Find trains from ${from} to ${to} on ${date} for ${adults} passenger(s).
              For EVERY train found, immediately emit: DATA: {"trainName": "...", "trainNumber": "...", "class": "...", "price": 0, "availability": "..."}.
              Return top 6 as JSON with key "trains".
              After loading the results, your primary goal is to find the CHEAPEST 3 options. Look for the lowest price tags on the page. Only return these top 3 cheapest deals in your JSON output. If there is a 'Cheapest' sort button on the website, click it first.`

    case 'buses':
      return `Find buses from ${from} to ${to} on ${date}. 
              For EVERY bus found, immediately emit: DATA: {"operatorName": "...", "busType": "...", "price": 0, "rating": 0}.
              Return top 6 as JSON with key "buses".
              After loading the results, your primary goal is to find the CHEAPEST 3 options. Look for the lowest price tags on the page. Only return these top 3 cheapest deals in your JSON output. If there is a 'Cheapest' sort button on the website, click it first.`

    case 'hotels':
      return `Find hotels in ${to} for check-in on ${date}.
              For EVERY hotel found, immediately emit: DATA: {"name": "...", "pricePerNight": 0, "stars": 0, "location": "..."}.
              Return top 8 as JSON with key "hotels".
              After loading the results, your primary goal is to find the CHEAPEST 3 options. Look for the lowest price tags on the page. Only return these top 3 cheapest deals in your JSON output. If there is a 'Cheapest' sort button on the website, click it first.`

    default:
      return `Find best travel deals from ${from} to ${to} on ${date}. 
              After loading the results, your primary goal is to find the CHEAPEST 3 options. Look for the lowest price tags on the page. Only return these top 3 cheapest deals in your JSON output. If there is a 'Cheapest' sort button on the website, click it first.
              Emit DATA: {...} for each deal. Return JSON.`
  }
}


// ─── Start URL builder (Fast-Track deep-links) ───────────────────

function buildStartUrl(
  type: string,
  from: string,
  to: string,
  date: string,
  adults: string = '1',
  cabinClass: string = 'economy'
): string {
  const params = { origin: from, dest: to, date1: date, adults, cabinClass }

  switch (type) {
    case 'flights': {
      // Prefer Google Flights deep-link for speed; skyscanner as fallback
      const profile = SITE_CONFIG['google.com']
      return profile ? profile.deepLink(params) : 'https://www.skyscanner.com'
    }
    case 'trains': {
      const profile = SITE_CONFIG['irctc.co.in']
      return profile ? profile.deepLink(params) : 'https://www.irctc.co.in'
    }
    case 'buses': {
      const profile = SITE_CONFIG['redbus.in']
      return profile ? profile.deepLink(params) : 'https://www.redbus.in'
    }
    case 'hotels': {
      const profile = SITE_CONFIG['booking.com']
      // Visit Booking.com by default
      return profile ? profile.deepLink(params) : 'https://www.agoda.com'
    }
    default:
      return `https://www.google.com/travel/flights?q=Flights+to+${encodeURIComponent(to)}+from+${encodeURIComponent(from)}`
  }
}
