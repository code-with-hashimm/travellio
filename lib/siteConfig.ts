/**
 * Fast-Track Site Config
 * ──────────────────────
 * Maps supported travel domains to:
 *  - CSS selectors for key UI elements (used as LLM hints to skip discovery)
 *  - A deep-link URL builder that bypasses the homepage entirely
 *
 * Usage in agent-stream/route.ts:
 *   getSiteConfig(domain)  → returns the SiteProfile or undefined
 *   buildDeepLink(...)     → returns a pre-filled search URL
 */

export interface SiteSelectors {
  search_input?  : string   // primary text/city input
  from_input?    : string   // origin field (when separate)
  to_input?      : string   // destination field (when separate)
  date_picker?   : string   // departure/check-in date trigger
  submit_button? : string   // "Search" / "Find" CTA
  result_item?   : string   // selector for a single result card (for scraping)
}

export interface SiteProfile {
  domain     : string
  selectors  : SiteSelectors
  deepLink   : (params: DeepLinkParams) => string
}

export interface DeepLinkParams {
  origin?    : string  // city / airport code
  dest       : string
  date1      : string  // ISO date YYYY-MM-DD or DD-MM-YYYY for site
  date2?     : string  // checkout (hotels)
  adults?    : string
  cabinClass?: string
}

// ─── Site Profiles ───────────────────────────────────────────────────────────

export const SITE_CONFIG: Record<string, SiteProfile> = {

  // ── Flights ──────────────────────────────────────────────────────────────

  'skyscanner.com': {
    domain: 'skyscanner.com',
    selectors: {
      from_input    : '[data-testid="origin-input"], #fsc-origin-search',
      to_input      : '[data-testid="destination-input"], #fsc-destination-search',
      date_picker   : '[data-testid="depart-date"], .DateInput_input',
      submit_button : '[data-testid="submit-button-only"], button[type="submit"]',
      result_item   : '[data-testid="itinerary-leg"]',
    },
    deepLink: ({ origin = '', dest, date1, adults = '1', cabinClass = 'economy' }) => {
      // Skyscanner deep-link: /transport/flights/DEL/BOM/YYMMDD/
      const d = date1.replace(/-/g, '').slice(2) // YYMMDD
      const cls = cabinClass === 'business' ? 'business' : 'economy'
      return `https://www.skyscanner.com/transport/flights/${origin}/${dest}/${d}/?adults=${adults}&cabinclass=${cls}&rtn=0`
    },
  },

  'google.com': {
    domain: 'google.com',
    selectors: {
      from_input    : 'input[aria-label="Where from?"]',
      to_input      : 'input[aria-label="Where to?"]',
      date_picker   : 'input[aria-label="Departure date"]',
      submit_button : 'button[aria-label="Search"]',
      result_item   : '[data-ved] .gws-flights__itinerary-card',
    },
    deepLink: ({ origin = '', dest, date1 }) =>
      `https://www.google.com/travel/flights?q=Flights%20to%20${encodeURIComponent(dest)}%20from%20${encodeURIComponent(origin)}%20on%20${encodeURIComponent(date1)}`,
  },

  'makemytrip.com': {
    domain: 'makemytrip.com',
    selectors: {
      from_input    : '#fromCity',
      to_input      : '#toCity',
      date_picker   : '#departure',
      submit_button : '.primaryBtn',
      result_item   : '.fli-list',
    },
    deepLink: ({ origin = '', dest, date1, adults = '1', cabinClass = 'economy' }) => {
      const [y, m, d] = date1.split('-')
      const cls = cabinClass === 'business' ? 'B' : 'E'
      return `https://www.makemytrip.com/flight/search?tripType=O&itinerary=${origin}-${dest}-${d}/${m}/${y}&paxType=A-${adults}_C-0_I-0&cabinClass=${cls}`
    },
  },

  // ── Hotels ───────────────────────────────────────────────────────────────

  'booking.com': {
    domain: 'booking.com',
    selectors: {
      search_input  : '[data-testid="destination-container"] input, #ss',
      date_picker   : '[data-testid="date-display-field-start"]',
      submit_button : '[data-testid="hero-header-searcher-button-cta"], button[type="submit"]',
      result_item   : '[data-testid="property-card"]',
    },
    deepLink: ({ dest, date1, date2, adults = '1' }) => {
      const checkout = date2 || shiftDate(date1, 1)
      return `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(dest)}&checkin=${date1}&checkout=${checkout}&group_adults=${adults}&no_rooms=1`
    },
  },

  // ── Buses ────────────────────────────────────────────────────────────────

  'redbus.in': {
    domain: 'redbus.in',
    selectors: {
      from_input    : '#src',
      to_input      : '#dst',
      date_picker   : '#onward_cal',
      submit_button : '#search_btn',
      result_item   : '.bus-item',
    },
    deepLink: ({ origin = '', dest, date1 }) => {
      // redBus date format: DD-Mon-YYYY e.g. 25-Mar-2026
      const formatted = formatRedBusDate(date1)
      return `https://www.redbus.in/bus-tickets/${slugify(origin)}-to-${slugify(dest)}?d=${encodeURIComponent(formatted)}`
    },
  },

  // ── Trains ───────────────────────────────────────────────────────────────

  'irctc.co.in': {
    domain: 'irctc.co.in',
    selectors: {
      from_input    : '#origin',
      to_input      : '#destination',
      date_picker   : '#jDate',
      submit_button : 'button[type="submit"].search_btn',
      result_item   : '.train-avl-enq-row',
    },
    deepLink: ({ origin = '', dest, date1 }) => {
      // IRCTC doesn't expose a clean deep-link; land on main search page
      const d = date1.replace(/-/g, '')   // YYYYMMDD
      return `https://www.irctc.co.in/nget/train-search?from=${encodeURIComponent(origin)}&to=${encodeURIComponent(dest)}&date=${d}`
    },
  },
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Returns the SiteProfile for a given full URL, or undefined if not mapped. */
export function getSiteConfig(url: string): SiteProfile | undefined {
  try {
    const hostname = new URL(url).hostname.replace(/^www\./, '')
    return SITE_CONFIG[hostname]
  } catch {
    return undefined
  }
}

/**
 * Builds a LLM hint string from a SiteProfile's selectors.
 * Inject this into the goal so the agent can skip element discovery.
 */
export function buildSelectorHints(profile: SiteProfile): string {
  const s = profile.selectors
  const hints: string[] = []
  if (s.from_input)    hints.push(`Origin input: "${s.from_input}"`)
  if (s.search_input)  hints.push(`Search/destination input: "${s.search_input}"`)
  if (s.to_input)      hints.push(`Destination input: "${s.to_input}"`)
  if (s.date_picker)   hints.push(`Date picker trigger: "${s.date_picker}"`)
  if (s.submit_button) hints.push(`Submit button: "${s.submit_button}"`)
  if (s.result_item)   hints.push(`Result cards: "${s.result_item}"`)
  return hints.length
    ? `\n\n[FAST-TRACK SELECTORS — use these directly without discovery]\n${hints.join('\n')}`
    : ''
}

// ─── Date utilities ──────────────────────────────────────────────────────────

/** Shift a YYYY-MM-DD date by N days, returns same format. */
function shiftDate(date: string, days: number): string {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

/** Format YYYY-MM-DD → DD-Mon-YYYY (e.g. 25-Mar-2026) for redBus. */
function formatRedBusDate(date: string): string {
  const d = new Date(date)
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  return `${String(d.getDate()).padStart(2,'0')}-${months[d.getMonth()]}-${d.getFullYear()}`
}

/** Simple slugifier for city names (lowercase, hyphen-separated). */
function slugify(city: string): string {
  return city.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}
