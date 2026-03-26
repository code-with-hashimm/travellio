export async function POST(request: Request) {
  const { runId } = await request.json()

  if (!runId) {
    return Response.json({ error: 'Missing runId' }, { status: 400 })
  }

  await fetch(
    `${process.env.TINYFISH_BASE_URL}/runs/${runId}/cancel`,
    {
      method : 'POST',
      headers: { 'X-API-Key': process.env.TINYFISH_API_KEY! },
    }
  )

  return Response.json({ cancelled: true })
}
