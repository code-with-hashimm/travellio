// ─── Search Tab Types ───────────────────
export type SearchTab = "flights" | "trains" | "buses" | "hotels";

export type CabinClass = "economy" | "premium_economy" | "business" | "first";
export type TrainClass = "all" | "SL" | "3A" | "2A" | "1A";
export type BusSeatType = "all" | "seater" | "sleeper" | "ac" | "non-ac";
export type HotelPropertyType = "all" | "hotel" | "hostel" | "resort" | "villa";

export interface SearchResult {
  flights : FlightResult[]
  trains  : TrainResult[]
  buses   : BusResult[]
  hotels  : HotelResult[]
}

// ─── Flight Types ───────────────────────
export interface FlightResult {
  id: string;
  airline: string;
  airlineLogo: string;
  flightNumber: string;
  aircraft: string;
  departureTime: string;
  departureCode: string;
  departureName: string;
  arrivalTime: string;
  arrivalCode: string;
  arrivalName: string;
  duration: string;
  stops: number;
  stopCity?: string;
  co2: string;
  co2Level: "low" | "avg" | "high";
  originalPrice: number;
  price: number;
  savings: number;
  isAIBestPick?: boolean;
  amenities: string[];
  baseFare: number;
  taxes: number;
  fees: number;
  priceHistory: number[];
  displayPrice?: string;
  source?: string;
}

// ─── Train Types ────────────────────────
export type ClassAvailability = "available" | "waitlist" | "full";

export interface TrainClassInfo {
  name: string;
  availability?: ClassAvailability;
  price: number;
  displayPrice?: string;
}

export interface TrainResult {
  id: string;
  trainName: string;
  trainNumber: string;
  departureTime: string;
  departureStation: string;
  departureCode: string;
  arrivalTime: string;
  arrivalStation: string;
  arrivalCode: string;
  duration: string;
  dayChange: number;
  classes: TrainClassInfo[];
  bookingUrl: string;
  source?: string;
}

// ─── Bus Types ──────────────────────────
export interface BusResult {
  id: string;
  operatorName: string;
  busType: string;
  departureTime: string;
  departurePoint: string;
  arrivalTime: string;
  arrivalPoint: string;
  duration: string;
  rating: number;
  reviews: number;
  amenities: string[];
  originalPrice: number;
  price: number;
  savings: number;
  seatsLeft: number;
  displayPrice?: string;
  source?: string;
}

// ─── Hotel Types ────────────────────────
export interface HotelResult {
  id: string;
  name: string;
  stars: number;
  reviewScore: number;
  reviewCount: number;
  location: string;
  image: string;
  amenities: string[];
  originalPrice: number;
  price: number;
  savings: number;
  freeCancellation: boolean;
  displayPrice?: string;
  source?: string;
}

// ─── Filter Types ───────────────────────
export interface FlightFilters {
  stops: "any" | 0 | 1 | 2;
  priceMin: number;
  priceMax: number;
  departureTime: string[];
  arrivalTime: string[];
  airlines: string[];
  maxDuration: number;
  cabinBag: boolean;
  checkedBag: boolean;
}

export interface SortOption {
  value: string;
  label: string;
}

// ─── Search Params ──────────────────────
export interface SearchParams {
  type: SearchTab;
  from: string;
  to: string;
  date: string;
  returnDate?: string;
  adults: number;
  children?: number;
  infants?: number;
  cabinClass?: CabinClass;
  trainClass?: TrainClass;
  busSeat?: BusSeatType;
  hotelType?: HotelPropertyType;
  rooms?: number;
}
