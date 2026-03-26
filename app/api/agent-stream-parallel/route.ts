/**
 * /api/agent-stream-parallel
 * ──────────────────────────
 * Fires multiple TinyFish browser tasks simultaneously (one per site)
 * using Promise.allSettled(), merges their SSE streams, and emits a
 * single unified SSE response in the same event format that useAgentStream.ts
 * already understands: STARTED → STREAMING_URL → PROGRESS → COMPLETE
 *
 * Existing route (/api/agent-stream) is untouched.
 */

import { NextRequest } from 'next/server'
import { SITE_CONFIG, buildSelectorHints, getSiteConfig } from '@/lib/siteConfig'

export const runtime    = 'nodejs'
export const maxDuration = 60

// ─── Types ───────────────────────────────────────────────────────────────────

interface SearchParams {
  type      : string
  from      : string
  to        : string
  date      : string
  adults    : string
  cabinClass: string
}

interface TaskTarget {
  label : string   // e.g. "Google Flights"
  url   : string   // deep-link start URL
  goal  : string   // full goal string with selector hints
}

// ─── Handler ─────────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {

  const body = await request.json()
  const params: SearchParams = {
    type      : body.type       || 'flights',
    from      : body.from       || '',
    to        : body.to         || '',
    date      : body.date       || '',
    adults    : body.adults     || '1',
    cabinClass: body.cabinClass || 'economy',
  }

  const missing: string[] = []
  if (!params.from) missing.push('from')
  if (!params.to)   missing.push('to')
  if (!params.date) missing.push('date')

  if (missing.length > 0) {
    return new Response(
      JSON.stringify({ error: 'Missing required search parameters', missing }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }

  if (!process.env.TINYFISH_API_KEY) {
    return new Response(
      JSON.stringify({ error: 'API key not configured' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }

  const targets = buildTargets(params)

  // ── Fire all TinyFish requests simultaneously using /run-async ──────────────
  const runTasks = targets.map(async (target) => {
    try {
      const res = await fetch(`${process.env.TINYFISH_BASE_URL}/automation/run-async`, {
        method : 'POST',
        headers: {
          'X-API-Key'   : process.env.TINYFISH_API_KEY!,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: target.url, goal: target.goal }),
      })

      if (!res.ok) {
        const text = await res.text()
        console.error(`TinyFish Async Error [${target.label}]:`, text)
        return null
      }

      const data = await res.json()
      return { label: target.label, runId: data.run_id }
    } catch (err) {
      console.error(`Fetch Error [${target.label}]:`, err)
      return null
    }
  })

  const runResults = await Promise.allSettled(runTasks)
  const runIds = runResults
    .filter((r): r is PromiseFulfilledResult<{ label: string; runId: string } | null> => r.status === 'fulfilled')
    .map(r => r.value)
    .filter(Boolean)

  return new Response(JSON.stringify({ runIds }), {
    headers: { 'Content-Type': 'application/json' },
  })
}

// ─── Helpers ─────────────────────────────────────────────────────────────────



// ─── Target builder ──────────────────────────────────────────────────────────

/**
 * For each search type, return an array of { label, url, goal } tasks —
 * one per site we want to hunt in parallel.
 */
function buildTargets(p: SearchParams): TaskTarget[] {
  const dlParams = {
    origin    : p.from,
    dest      : p.to,
    date1     : p.date,
    adults    : p.adults,
    cabinClass: p.cabinClass,
  }

  switch (p.type) {

    case 'flights': {
      const sites = [
        { key: 'google.com',       label: 'Google Flights' },
        { key: 'skyscanner.com',   label: 'Skyscanner'     },
        { key: 'makemytrip.com',   label: 'MakeMyTrip'     },
      ]
      return sites.map(({ key, label }) => {
        const profile = SITE_CONFIG[key]
        if (!profile) return null
        const url  = profile.deepLink(dlParams)
        const goal = buildFlightGoal(p) + buildSelectorHints(profile)
        return { label, url, goal }
      }).filter(Boolean) as TaskTarget[]
    }

    case 'buses': {
      // Hunt both redBus AND AbhiBus, combine, sort cheapest first
      const rbProfile = SITE_CONFIG['redbus.in']
      const targets: TaskTarget[] = []
      if (rbProfile) {
        targets.push({
          label: 'redBus',
          url  : rbProfile.deepLink(dlParams),
          goal : buildBusGoal(p) + buildSelectorHints(rbProfile),
        })
      }
      // AbhiBus — no siteConfig entry yet; use homepage with search context in goal
      targets.push({
        label: 'AbhiBus',
        url  : `https://www.abhibus.com/bus_search/${encodeURIComponent(p.from)}/${encodeURIComponent(p.to)}/${p.date}/1/S`,
        goal : buildBusGoal(p),
      })
      return targets
    }

    case 'hotels': {
      const bProfile = SITE_CONFIG['booking.com']
      const targets: TaskTarget[] = []
      if (bProfile) {
        targets.push({
          label: 'Booking.com',
          url  : bProfile.deepLink(dlParams),
          goal : buildHotelGoal(p) + buildSelectorHints(bProfile),
        })
      }
      // Agoda fallback
      targets.push({
        label: 'Agoda',
        url  : `https://www.agoda.com/search?city=${encodeURIComponent(p.to)}&checkIn=${p.date}`,
        goal : buildHotelGoal(p),
      })
      return targets
    }

    case 'trains': {
      const targets: TaskTarget[] = []
      // Primary: Ixigo
      targets.push({
        label: 'ixigo',
        url  : `https://www.ixigo.com/trains`,
        goal : buildTrainGoal(p),
      })
      // Fallback: ConfirmTkt
      targets.push({
        label: 'ConfirmTkt',
        url  : `https://www.confirmtkt.com/rly-search?fromCode=${encodeURIComponent(p.from)}&toCode=${encodeURIComponent(p.to)}&date=${p.date}`,
        goal : buildTrainGoal(p),
      })
      return targets
    }

    default:
      return []
  }
}

// ─── Universal Extraction Rules ──────────────────────────────────────────────

const UNIVERSAL_RULES = `
### UNIVERSAL CHEAPEST PRICE SNIPER RULES:
1. **The Sniper Goal**: Your primary and ONLY goal is to find the SINGLE ABSOLUTE CHEAPEST deal on the entire page. Do not extract multiple results. Find the one with the lowest total price.
2. **Sort First**: If there is a 'Sort by Price', 'Lowest Price', or 'Cheapest' button/filter, you MUST click it first before extracting any data.
3. **Currency Intelligence (CRITICAL)**: You MUST identify the currency symbol of the price (e.g., $, ₹, £, €, AED). Return the price as a string including the symbol (e.g., "$75" or "₹4500"). Do NOT return just numbers.
4. **Smart Extraction**:
   - **Main Price**: Focus only on the largest, most prominent price which represents the Total Fare.
   - **Ignore Noise**: Strictly ignore secondary numbers like Taxes (if separate), 플랫폼 피 (platform fees), Seats Left, or Ratings.
   - **Provider Info**: Correctly capture the Provider Name (e.g. "IndiGo via Skyscanner").
5. **Validation Guardrail**: If the price seems unusually low (less than 1/10th of the page average), discard it as a likely fee and find the actual ticket price.
`;

// ─── Goal builders ───────────────────────────────────────────────────────────

function buildFlightGoal(p: SearchParams) {
  return (
    `You are a deal-hunting agent. Your goal is to find the CHEAPEST one-way flights from ${p.from} to ${p.to} on ${p.date} for ${p.adults} adult(s) in ${p.cabinClass} class.` +
    `\n\n${UNIVERSAL_RULES}` +
    `\n\nINSTRUCTIONS:` +
    `\n1. Visit this site and search for the route.` +
    `\n2. For EVERY flight found, immediately emit its data in this format: DATA: {"airline": "...", "flightNumber": "...", "departureTime": "...", "arrivalTime": "...", "duration": "...", "stops": 0, "price": 0}.` +
    `\n3. Extract the top 4 results and return them as a final JSON object with key "flights".` +
    `\n4. Do NOT use markdown. Emit DATA: lines as plain text in your progress output.`
  )
}

function buildTrainGoal(p: SearchParams) {
  return (
    `You are a deal-hunting agent. Your goal is to find trains from ${p.from} to ${p.to} on ${p.date} for ${p.adults} passenger(s) using ixigo.` +
    `\n\n${UNIVERSAL_RULES}` +
    `\n\nINSTRUCTIONS:` +
    `\n1. Navigate to ixigo trains (https://www.ixigo.com/trains).` +
    `\n2. Enter source (${p.from}), destination (${p.to}), and date (${p.date}).` +
    `\n3. Click "Search" and wait for the results to load.` +
    `\n4. For EVERY train found, you MUST find and emit prices for all 4 major classes: Sleeper (SL), 3rd AC (3A), 2nd AC (2A), and 1st AC (1A).` +
    `\n5. Emit each train data in this format: DATA: {"trainName": "...", "trainNumber": "...", "departureTime": "...", "arrivalTime": "...", "duration": "...", "classes": [{"name": "SL", "price": 500}, {"name": "3A", "price": 1200}, {"name": "2A", "price": 1800}, {"name": "1A", "price": 2500}], "bookingUrl": "..."}.` +
    `\n6. Ensure the "price" for each class is a clean integer. Ensure they are sorted CHEAPEST TO MOST EXPENSIVE.` +
    `\n7. The "bookingUrl" MUST be the direct URL to the ixigo search result page for this specific train.` +
    `\n8. Return the data as a clean JSON array with key "trains".` +
    `\n9. Do NOT try to solve complex captchas; if blocked, try to refresh or move to the next result.` +
    `\n10. Do NOT use markdown. Emit DATA: lines as plain text.`
  )
}

function buildBusGoal(p: SearchParams) {
  return (
    `You are a deal-hunting agent. Find buses from ${p.from} to ${p.to} on ${p.date}.` +
    `\n\n${UNIVERSAL_RULES}` +
    `\n\nINSTRUCTIONS:` +
    `\n1. Search for the bus route on this site.` +
    `\n2. Focus on finding buses that match the user's requested class: ${p.cabinClass}.` +
    `\n3. For EVERY bus found, immediately emit: DATA: {"operatorName": "...", "busType": "...", "departureTime": "...", "arrivalTime": "...", "duration": "...", "price": 0, "rating": 4.5, "bookingUrl": "..."}.` +
    `\n4. Return a final JSON object with key "buses".` +
    `\n5. The "bookingUrl" MUST be the direct URL to the provider's search result or booking page.`
  )
}

function buildHotelGoal(p: SearchParams) {
  return (
    `You are a deal-hunting agent. Find hotels in ${p.to} for check-in ${p.date} for ${p.cabinClass}.` +
    `\n\n${UNIVERSAL_RULES}` +
    `\n\nINSTRUCTIONS:` +
    `\n1. Search for available hotels on this site matching the guest/room requirement: ${p.cabinClass}.` +
    `\n2. For EVERY hotel found, immediately emit: DATA: {"name": "...", "stars": 5, "reviewScore": 8.5, "location": "...", "pricePerNight": 0}.` +
    `\n3. Return a final JSON object with key "hotels".`
  )
}
