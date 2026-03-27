import { NextRequest } from 'next/server'
import { getSiteConfig, buildSelectorHints, SITE_CONFIG } from '@/lib/siteConfig'

export const runtime = 'nodejs'
export const maxDuration = 30

const CITY_TO_IATA: Record<string, string> = {
  mumbai: 'BOM',
  delhi: 'DEL',
  ahmedabad: 'AMD',
  bangalore: 'BLR',
  pune: 'PNQ',
  hyderabad: 'HYD',
  chennai: 'MAA',
  kolkata: 'CCU',
  goa: 'GOI',
  jaipur: 'JAI',
  agra: 'AGR',
  varanasi: 'VNS',
  kochi: 'COK',
  trivandrum: 'TRV',
  coimbatore: 'CJB',
  indore: 'IDR',
  lucknow: 'LKO',
  amritsar: 'ATQ',
  chandigarh: 'IXC',
  nagpur: 'NAG',
  aurangabad: 'IXU',
  nashik: 'ISK',
  kolhapur: 'KLH',
  solapur: 'SSE',
  jalgaon: 'JL',
  nanded: 'NDC',
  // Global additions
  tokyo: 'NRT',
  seoul: 'ICN',
  bangkok: 'BKK',
  singapore: 'SIN',
  hongkong: 'HKG',
  shanghai: 'PVG',
  beijing: 'PEK',
  manila: 'MNL',
  jakarta: 'CGK',
  kualalumpur: 'KUL',
  dubai: 'DXB',
  doha: 'DOH',
  riyadh: 'RUH',
  istanbul: 'IST',
  london: 'LHR',
  paris: 'CDG',
  amsterdam: 'AMS',
  frankfurt: 'FRA',
  madrid: 'MAD',
  barcelona: 'BCN',
  rome: 'FCO',
  milan: 'MXP',
  athens: 'ATH',
  berlin: 'BER',
  moscow: 'SVO',
  dublin: 'DUB',
  zurich: 'ZRH',
  vienna: 'VIE',
  copenhagen: 'CPH',
  helsinki: 'HEL',
  lisbon: 'LIS',
  porto: 'OPO',
  brussels: 'BRU',
  prague: 'PRG',
  budapest: 'BUD',
  warsaw: 'WAW',
  newyork: 'JFK',
  losangeles: 'LAX',
  chicago: 'ORD',
  miami: 'MIA',
  lasvegas: 'LAS',
  sanfrancisco: 'SFO',
  toronto: 'YYZ',
  vancouver: 'YVR',
  mexicocity: 'MEX',
  cancun: 'CUN',
  atlanta: 'ATL',
  dallas: 'DFW',
  denver: 'DEN',
  houston: 'IAH',
  boston: 'BOS',
  washington: 'IAD',
  saopaulo: 'GRU',
  rio: 'GIG',
  buenosaires: 'EZE',
  bogota: 'BOG',
  lima: 'LIM',
  santiago: 'SCL',
  johannesburg: 'JNB',
  capetown: 'CPT',
  cairo: 'CAI',
  lagos: 'LOS',
  nairobi: 'NBO',
  addisababa: 'ADD',
  casablanca: 'CMN',
  marrakech: 'RAK',
  sydney: 'SYD',
  melbourne: 'MEL',
  brisbane: 'BNE',
  auckland: 'AKL',
  perth: 'PER'
};

function getIata(city: string): string {
  const clean = city.toLowerCase().trim().replace(/[^a-z]/g, '')
  return CITY_TO_IATA[clean] || city.toUpperCase().slice(0, 3)
}

interface Target {
  label: string;
  url: string;
}

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

  // 2. Build the start URLs (Parallel targets)
  const targets = buildStartUrl(type, from, to, date, adults, cabinClass)

  // 3. Trigger multiple TinyFish runs in parallel
  const runTasks = targets.map(async (target) => {
    const siteProfile = getSiteConfig(target.url)
    const selectorHints = siteProfile ? buildSelectorHints(siteProfile) : ''
    const goal = buildGoal(type, from, to, date, target.label, adults, cabinClass) + selectorHints

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10s timeout to START the agent

      const res = await fetch(
        `${process.env.TINYFISH_BASE_URL}/automation/run-sse`,
        {
          method: 'POST',
          headers: {
            'X-API-Key': process.env.TINYFISH_API_KEY!,
            'Content-Type': 'application/json',
          },
          signal: controller.signal,
          body: JSON.stringify({
            url: target.url,
            goal: goal,
          }),
        }
      )
      clearTimeout(timeoutId)

      if (!res.ok) throw new Error(`TinyFish error: ${res.status}`)

      // Since /run-sse returns a stream, we extract the run_id from headers or the first chunk if possible
      // Actually, standard TinyFish /run-sse often returns run_id in a header or the first event
      // However, if we want to return runIds to the frontend, we might prefer the non-SSE /run endpoint
      // for faster parallel handshakes.

      // Let's assume for this parallel model we use the standard /run endpoint to get runId quickly
      const runRes = await fetch(
        `${process.env.TINYFISH_BASE_URL}/automation/run`,
        {
          method: 'POST',
          headers: {
            'X-API-Key': process.env.TINYFISH_API_KEY!,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url: target.url, goal: goal }),
        }
      )
      const data = await runRes.json()
      return { runId: data.runId, label: target.label }
    } catch (err) {
      console.error(`Failed to start agent for ${target.label}:`, err)
      return null
    }
  })

  const results = await Promise.allSettled(runTasks)
  const runIds = results
    .map(r => r.status === 'fulfilled' ? r.value : null)
    .filter(Boolean)

  if (runIds.length === 0) {
    return new Response(
      JSON.stringify({ error: 'Failed to start any search agents' }),
      { status: 502, headers: { 'Content-Type': 'application/json' } }
    )
  }

  // 4. Return the list of runIds to the client
  return new Response(JSON.stringify({ runIds }), {
    headers: { 'Content-Type': 'application/json' },
  })
}


// ─── Goal builder ────────────────────────────────────────────────

function buildGoal(
  type: string,
  from: string,
  to: string,
  date: string,
  siteLabel: string,
  adults: string = '1',
  cabinClass: string = 'economy'
): string {
  const isDirectResults = ['Kayak', 'Agoda'].includes(siteLabel);
  const siteHint = isDirectResults
    ? "You are already on the search results page. Do NOT search again. Just identify and extract the data."
    : `Please search for trips from ${from} to ${to} on ${date} first.`;

  const GUARDRAIL = "If the website does not load within 25 seconds or shows a CAPTCHA/Bot-detection screen, STOP immediately and return an empty array or partial data. Do not stay stuck on a blocked page.";
  const SOURCE_GUARDRAIL = `It is CRITICAL to include the "source" key with the value "${siteLabel}" in every DATA emit so the user knows where the deal is coming from.`;

  switch (type) {
    case 'flights':
      return `${GUARDRAIL}
              ${siteHint}
              ${SOURCE_GUARDRAIL}
              You are a flight-hunting sniper. Find one-way flights from ${from} to ${to} on ${date} for ${adults} adult(s).
              If the site is blocked or shows a CAPTCHA, STOP IMMEDIATELY.
              For EVERY flight found, immediately emit its data: DATA: {"airline": "...", "price": 0, "source": "${siteLabel}", "duration": "...", "stops": 0}.
              Return top 8 as JSON (flights). Extract the CHEAPEST 3 deals from the specific page you land on.`

    case 'trains':
      return `${GUARDRAIL}
              ${siteHint}
              ${SOURCE_GUARDRAIL}
              Find trains from ${from} to ${to} on ${date}.
              For EVERY train found, immediately emit: DATA: {"trainName": "...", "trainNumber": "...", "source": "${siteLabel}", "class": "...", "price": 0, "availability": "..."}.
              Return top 6 as JSON with key "trains".`

    case 'buses':
      return `${GUARDRAIL}
              ${siteHint}
              ${SOURCE_GUARDRAIL}
              Find buses from ${from} to ${to} on ${date}. 
              For EVERY bus found, immediately emit: DATA: {"operatorName": "...", "busType": "...", "source": "${siteLabel}", "price": 0, "rating": 0}.
              Return top 6 as JSON with key "buses".`

    case 'hotels':
      return `${GUARDRAIL}
              ${siteHint}
              ${SOURCE_GUARDRAIL}
              Find hotels in ${to} for check-in on ${date}.
              For EVERY hotel found, immediately emit: DATA: {"name": "...", "pricePerNight": 0, "source": "${siteLabel}", "stars": 0, "location": "..."}.
              Return top 8 as JSON with key "hotels".`

    default:
      return `${GUARDRAIL}
              ${siteHint}
              Find best travel deals from ${from} to ${to} on ${date}.`
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
): Target[] {
  const fromIata = getIata(from)
  const toIata = getIata(to)

  switch (type) {
    case 'flights': {
      return [
        { label: 'Kayak', url: `https://www.kayak.co.in/flights/${fromIata}-${toIata}/${date}?sort=price_a` },
        { label: 'Cleartrip', url: `https://www.cleartrip.com/flights/results?from=${fromIata}&to=${toIata}&date=${date}&adults=${adults}` },
        { label: 'Ixigo', url: `https://www.ixigo.com/search/result/flight/${fromIata}/${toIata}/${date}/1/0/0/e` }
      ]
    }
    case 'trains': {
      return [
        { label: 'Cleartrip', url: 'https://www.cleartrip.com/trains' },
        { label: 'ConfirmTkt', url: 'https://www.confirmtkt.com' }
      ]
    }
    case 'buses': {
      return [
        { label: 'AbhiBus', url: `https://www.abhibus.com/bus_search/${encodeURIComponent(from)}/${encodeURIComponent(to)}/${date}/1/S` },
        { label: 'Zingbus', url: 'https://www.zingbus.com' }
      ]
    }
    case 'hotels': {
      return [
        { label: 'Agoda', url: `https://www.agoda.com/search?city=${encodeURIComponent(to)}&checkIn=${date}&sort=price` },
        { label: 'Goibibo', url: 'https://www.goibibo.com/hotels/' }
      ]
    }
    default:
      return [{ label: 'Google', url: `https://www.google.com/search?q=deals+from+${from}+to+${to}` }]
  }
}
