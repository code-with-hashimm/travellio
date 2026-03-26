import { FlightResult, TrainResult, BusResult, HotelResult } from "./searchTypes";

// ─── Currency Helpers ──────────────────────────────────────────

const USD_TO_INR = 83;

function parseCurrency(raw: any): { price: number; displayPrice: string } {
  if (typeof raw === "number") {
    return { price: raw, displayPrice: `₹${raw}` };
  }
  
  if (typeof raw !== "string") {
    return { price: 0, displayPrice: "₹0" };
  }

  // Extract symbol (everything but numbers, dots, commas)
  const symbol = raw.replace(/[0-9.,\s]/g, "") || "₹";
  // Extract number
  const numericStr = raw.replace(/[^0-9.]/g, "");
  const numeric = Math.round(parseFloat(numericStr) || 0);

  if (symbol === "$") {
    const inr = numeric * USD_TO_INR;
    return { price: inr, displayPrice: `₹${inr}` };
  }

  return { price: numeric, displayPrice: `${symbol}${numeric}` };
}

export function mapFlightResult(raw: any, index: number): FlightResult {
  const { price, displayPrice } = parseCurrency(raw.price || raw.discountedPrice || 0);
  const { price: originalPrice } = parseCurrency(raw.originalPrice || raw.price || 0);

  return {
    id: raw.id || `flight-${index}-${Date.now()}`,
    airline: raw.airline || raw.airlineName || "Unknown Airline",
    airlineLogo: raw.airlineLogo || "",
    flightNumber: raw.flightNumber || raw.flight_number || "",
    aircraft: raw.aircraft || "",
    departureTime: raw.departureTime || raw.departure || "",
    departureCode: raw.departureCode || "",
    departureName: raw.departureName || "",
    arrivalTime: raw.arrivalTime || raw.arrival || "",
    arrivalCode: raw.arrivalCode || "",
    arrivalName: raw.arrivalName || "",
    duration: raw.duration || "",
    stops: raw.stops || 0,
    stopCity: raw.stopCity || "",
    co2: raw.co2 || "",
    co2Level: raw.co2Level || "avg",
    originalPrice,
    price,
    displayPrice,
    savings: raw.savings || raw.savedPercent || 0,
    isAIBestPick: raw.isAIBestPick || false,
    amenities: raw.amenities || [],
    baseFare: raw.baseFare || 0,
    taxes: raw.taxes || 0,
    fees: raw.fees || 0,
    priceHistory: raw.priceHistory || []
  };
}

export function mapTrainResult(raw: any, index: number): TrainResult {
  return {
    id: raw.id || `train-${index}`,
    trainName: raw.trainName || "Unknown Train",
    trainNumber: raw.trainNumber || "",
    departureTime: raw.departureTime || "",
    departureStation: raw.departureStation || "",
    departureCode: raw.departureCode || "",
    arrivalTime: raw.arrivalTime || "",
    arrivalStation: raw.arrivalStation || "",
    arrivalCode: raw.arrivalCode || "",
    duration: raw.duration || "",
    dayChange: raw.dayChange || 0,
    classes: (raw.classes || []).map((c: any) => {
      const { price, displayPrice } = parseCurrency(c.price);
      return { ...c, price, displayPrice };
    }),
    bookingUrl: raw.bookingUrl || ""
  };
}

export function mapBusResult(raw: any, index: number): BusResult {
  const { price, displayPrice } = parseCurrency(raw.price || raw.discountedPrice || 0);
  const { price: originalPrice } = parseCurrency(raw.originalPrice || raw.price || 0);

  return {
    id: raw.id || `bus-${index}-${Date.now()}`,
    operatorName: raw.operatorName || raw.operator || "Unknown Operator",
    busType: raw.busType || raw.type || "",
    departureTime: raw.departureTime || raw.departure || "",
    departurePoint: raw.departurePoint || raw.pickupPoint || "",
    arrivalTime: raw.arrivalTime || raw.arrival || "",
    arrivalPoint: raw.arrivalPoint || raw.dropPoint || "",
    duration: raw.duration || "",
    rating: raw.rating || 0,
    reviews: raw.reviews || 0,
    amenities: raw.amenities || [],
    originalPrice,
    price,
    displayPrice,
    savings: raw.savings || 0,
    seatsLeft: raw.seatsLeft || 0
  };
}

export function mapHotelResult(raw: any, index: number): HotelResult {
  const { price, displayPrice } = parseCurrency(raw.price || raw.pricePerNight || 0);
  const { price: originalPrice } = parseCurrency(raw.originalPrice || raw.price || 0);

  return {
    id: raw.id || `hotel-${index}-${Date.now()}`,
    name: raw.name || "Unknown Hotel",
    stars: raw.stars || 0,
    reviewScore: raw.reviewScore || raw.rating || 0,
    reviewCount: raw.reviewCount || 0,
    location: raw.location || "",
    image: raw.image || "",
    amenities: raw.amenities || [],
    originalPrice,
    price,
    displayPrice,
    savings: raw.savings || 0,
    freeCancellation: raw.freeCancellation || false
  };
}

// ─── Provider URL Generator ──────────────────────────────────────
// Takes deal data and search context, returns a deep-link booking URL.

export interface ProviderUrlContext {
  origin?  : string   // e.g. "Delhi"
  dest?    : string   // e.g. "Mumbai"
  date?    : string   // YYYY-MM-DD
  adults?  : string
  checkout?: string   // hotels only
}

export function generateProviderUrl(
  deal    : { operatorName?: string; airline?: string; name?: string; [key: string]: any },
  context : ProviderUrlContext = {}
): string {
  const { origin = '', dest = '', date = '', adults = '1', checkout } = context
  const enc = encodeURIComponent

  // Normalise provider name — use whichever field is present
  const provider = (
    deal.airline || deal.operatorName || deal.name || ''
  ).toLowerCase()

  // ── Hotels ─────────────────────────────────────────────────────
  if (deal.name && !deal.airline && !deal.operatorName) {
    const co = checkout || shiftDateBy(date, 1)
    if (provider.includes('booking') || deal.source === 'booking.com') {
      return `https://www.booking.com/searchresults.html?ss=${enc(dest)}&checkin=${date}&checkout=${co}&group_adults=${adults}`
    }
    if (provider.includes('expedia') || deal.source === 'expedia') {
      return `https://www.expedia.com/Hotel-Search?destination=${enc(dest)}&startDate=${date}&endDate=${co}&adults=${adults}`
    }
    // Generic hotel fallback — Booking.com with destination
    return `https://www.booking.com/searchresults.html?ss=${enc(dest)}&checkin=${date}&checkout=${co}&group_adults=${adults}`
  }

  // ── Buses ──────────────────────────────────────────────────────
  if (deal.operatorName) {
    // redBus slugified route deep-link
    const slug = (s: string) => s.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    const d = formatRedBusDate(date)
    return `https://www.redbus.in/bus-tickets/${slug(origin)}-to-${slug(dest)}?d=${enc(d)}`
  }

  // ── Flights ────────────────────────────────────────────────────
  if (deal.airline) {
    const al = provider

    if (al.includes('indigo')) {
      return `https://www.goindigo.in/flight-booking.html?origin=${enc(origin)}&destination=${enc(dest)}&departDate=${date}&adult=${adults}`
    }
    if (al.includes('air india')) {
      return `https://www.airindia.com/book-flights.htm?origin=${enc(origin)}&destination=${enc(dest)}&date=${date}&adults=${adults}`
    }
    if (al.includes('spicejet')) {
      return `https://book.spicejet.com/?depStationCode=${enc(origin)}&arrStationCode=${enc(dest)}&searchMonth=${date}&adult=${adults}`
    }
    if (al.includes('vistara') || al.includes('air asia')) {
      return `https://www.makemytrip.com/flight/search?tripType=O&itinerary=${enc(origin)}-${enc(dest)}-${date}&paxType=A-${adults}_C-0_I-0`
    }
    // Google Flights — works for any airline
    return `https://www.google.com/travel/flights?q=Flights+to+${enc(dest)}+from+${enc(origin)}+on+${enc(date)}`
  }

  // ── Ultimate fallback ──────────────────────────────────────────
  return `https://www.google.com/search?q=${enc(`cheap travel ${origin} to ${dest} ${date}`)}`
}

/** Shift a YYYY-MM-DD date forward by N days. */
function shiftDateBy(date: string, days: number): string {
  if (!date) return ''
  try {
    const d = new Date(date)
    d.setDate(d.getDate() + days)
    return d.toISOString().slice(0, 10)
  } catch { return '' }
}

/** Format YYYY-MM-DD → DD-Mon-YYYY for redBus. */
function formatRedBusDate(date: string): string {
  if (!date) return ''
  try {
    const d = new Date(date)
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    return `${String(d.getDate()).padStart(2,'0')}-${months[d.getMonth()]}-${d.getFullYear()}`
  } catch { return date }
}
