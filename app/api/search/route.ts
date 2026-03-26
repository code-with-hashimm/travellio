import { NextRequest } from "next/server";

export const dynamic = 'force-dynamic';

function buildAgentTask(type: string, from: string, to: string, date: string, adults: string, cabinClass: string) {
  if (type === 'flights') {
    return `Find the cheapest flights from ${from} to ${to} on ${date} for ${adults || 1} adult(s) in ${cabinClass || 'Economy'} class. Return top 8 results with airline, times, price, duration and stops.`;
  } else if (type === 'trains') {
    return `Find available trains from ${from} to ${to} on ${date} for ${adults || 1} passenger(s). Return top 6 results with train name, number, timings, class availability and price.`;
  } else if (type === 'buses') {
    return `Find available buses from ${from} to ${to} on ${date}. Return top 6 results with operator, timings, bus type and price.`;
  } else if (type === 'hotels') {
    return `Find hotels in ${to} for check-in ${date}. Return top 8 results with hotel name, star rating, price per night, amenities and availability.`;
  }
  return `Search ${type} from ${from} to ${to} on ${date}`;
}

export async function POST(request: NextRequest) {
  if (!process.env.TINYFISH_API_KEY) {
    return new Response(JSON.stringify({ error: "Service unavailable: Missing API credentials" }), { status: 401 });
  }

  try {
    const body = await request.json();
    const { type, from, to, date, adults, class: cabinClass } = body;

    const response = await fetch(process.env.TINYFISH_BASE_URL + '/agent/run', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.TINYFISH_API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream',
      },
      body: JSON.stringify({
        task: buildAgentTask(type, from, to, date, adults, cabinClass),
      }),
    });

    if (response.status === 429) {
      return new Response(JSON.stringify({ error: "Too many requests, please wait" }), { status: 429 });
    }

    if (!response.ok) {
      return new Response(JSON.stringify({ error: `Downstream error: ${response.statusText}` }), { status: response.status });
    }

    return new Response(response.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error: any) {
    console.error("Agent Search API Error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}
