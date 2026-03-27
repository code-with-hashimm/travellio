'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import type { SearchResult } from '@/lib/searchTypes'
import { 
  mapFlightResult, 
  mapTrainResult, 
  mapBusResult, 
  mapHotelResult 
} from '@/lib/mappers'

export type AgentStatus =
  | 'idle'
  | 'started'
  | 'streaming'
  | 'complete'
  | 'error'

export interface AgentStreamState {
  status      : AgentStatus
  streams     : Record<string, string>
  activeStreamId: string | null
  setActiveStreamId: (id: string | null) => void
  agents      : { runId: string; label: string; status: string }[]
  progressPct : number
  statusMsg   : string
  elapsedMs   : number
  sourcesCount: number
  dealsFound  : number
  runId       : string | null
  result      : SearchResult | null
  error       : string | null
  isAnyAgentRunning: boolean
  isInitialLoading: boolean
  startStream : (params: URLSearchParams) => void
  stopStream  : () => void
}

export function useAgentStream(): AgentStreamState {

  const [status,         setStatus]         = useState<AgentStatus>('idle')
  const [streams,        setStreams]        = useState<Record<string, string>>({})
  const [activeStreamId, setActiveStreamId] = useState<string | null>(null)
  const [agents,         setAgents]         = useState<{ runId: string; label: string; status: string }[]>([])
  const [progressPct,    setProgressPct]    = useState(0)
  const [statusMsg,      setStatusMsg]      = useState('')
  const [elapsedMs,      setElapsedMs]      = useState(0)
  const [sourcesCount,   setSourcesCount]   = useState(0)
  const [dealsFound,     setDealsFound]     = useState(0)
  const [runId,          setRunId]          = useState<string | null>(null)
  const [result,         setResult]         = useState<SearchResult | null>(null)
  const [error,          setError]          = useState<string | null>(null)

  const isAnyAgentRunning = agents.some(a => a.status === 'RUNNING' || a.status === 'STARTED');
  const isInitialLoading = (status === 'started' || status === 'streaming') && dealsFound === 0;

  const abortRef    = useRef<AbortController | null>(null)
  const timerRef    = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef= useRef<number>(0)
  const timeoutRef  = useRef<NodeJS.Timeout | null>(null)
  const hasStreamRef = useRef<boolean>(false)

  // Elapsed time ticker & Dynamic Status Messages
  useEffect(() => {
    if (status === 'started' || status === 'streaming') {
      timerRef.current = setInterval(() => {
        const elapsed = Date.now() - startTimeRef.current
        setElapsedMs(elapsed)
        
        // Time-based status messages
        if (elapsed < 5000) setStatusMsg('Launching browser...')
        else if (elapsed < 10000) setStatusMsg('Loading travel site...')
        else if (elapsed < 15000) setStatusMsg('Searching for deals...')
        else if (elapsed < 20000) setStatusMsg('Comparing prices...')
        else setStatusMsg('Almost done, finalising results...')
      }, 1000)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [status])

  const stopStream = useCallback(() => {
    if (runId) {
      fetch('/api/cancel', {
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify({ runId }),
      })
    }

    if (abortRef.current)  abortRef.current.abort()
    if (timerRef.current)  clearInterval(timerRef.current)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setStatus('idle')
    setStreams({})
    setActiveStreamId(null)
    setAgents([])
    setProgressPct(0)
    setStatusMsg('')
    setElapsedMs(0)
    setSourcesCount(0)
    setDealsFound(0)
    setRunId(null)
    setResult(null)
    setError(null)
  }, [runId])

  const startStream = useCallback(async (params: URLSearchParams) => {
    // Reset state
    stopStream()

    const controller = new AbortController()
    abortRef.current = controller
    startTimeRef.current = Date.now()

    setStatus('started')
    setError(null)
    setProgressPct(0)
    setSourcesCount(0)
    setDealsFound(0)
    setStreams({})
    setActiveStreamId(null)
    setAgents([])
    setResult(null)
    hasStreamRef.current = false

    // 20s Smart Timeout: If no STREAMING_URL is received, abort
    timeoutRef.current = setTimeout(() => {
      if (!hasStreamRef.current && (status === 'started' || status === 'streaming')) {
        stopStream()
        setError('Search timed out. Try a different route.')
        setStatus('error')
      }
    }, 20000)

    try {
      // 1. Initiate parallel runs via our refactored async route
      const response = await fetch('/api/agent-stream-parallel', {
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal : controller.signal,
        body   : JSON.stringify({
          type      : params.get('type')    || 'flights',
          from      : params.get('from')    || '',
          to        : params.get('to')      || '',
          date      : params.get('date')    || '',
          adults    : params.get('adults')  || '1',
          cabinClass: params.get('class')   || 'economy',
        }),
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error || 'Failed to start agent')
      }

      const { runIds: runs } = await response.json()
      if (!runs || runs.length === 0) {
        throw new Error('No agent tasks could be started')
      }

      setStatus('streaming')
      setSourcesCount(runs.length)
      setAgents(runs.map((r: any) => ({ runId: r.runId, label: r.label, status: 'RUNNING' })))
      
      // 2. Poll each run status in parallel
      const activeRuns = new Set(runs.map((r: any) => r.runId))
      const pollers = runs.map(async (run: any) => {
        const { runId, label } = run
        
        while (activeRuns.has(runId)) {
          if (controller.signal.aborted) break
          
          try {
            const res = await fetch(`/api/agent-run-status/${runId}`, { signal: controller.signal })

            if (!res.ok) {
              console.error(`Status check failed for ${label} [${res.status}]`)
              activeRuns.delete(runId)
              break
            }
            
            const data = await res.json()
            
            // Update live preview URL if available
            if (data.streaming_url) {
              hasStreamRef.current = true
              setStreams(prev => ({ ...prev, [runId]: data.streaming_url }))
              setActiveStreamId(prev => prev || runId)
            }
            
            if (data.status === 'COMPLETED') {
              activeRuns.delete(runId)
              setAgents(prev => prev.map(a => a.runId === runId ? { ...a, status: 'COMPLETED' } : a))
              const mapped = mapResult(data.result)
              
              setResult(prev => {
                const current = prev || { flights: [], trains: [], buses: [], hotels: [] }
                const merged = {
                  flights: mergeUnique(current.flights, mapped.flights),
                  trains:  mergeUnique(current.trains,  mapped.trains),
                  buses:   mergeUnique(current.buses,   mapped.buses),
                  hotels:  mergeUnique(current.hotels,  mapped.hotels),
                }
                setDealsFound(countDeals(merged))
                return merged
              })
              break
            }
            
            if (data.status === 'FAILED' || data.status === 'CANCELLED') {
              activeRuns.delete(runId)
              setAgents(prev => prev.map(a => a.runId === runId ? { ...a, status: data.status } : a))
              console.error(`Run ${runId} (${label}) reached terminal state: ${data.status}`)
              break
            }
          } catch (e: any) {
            if (e.name === 'AbortError') break
            console.error(`Polling error for ${label}:`, e)
            // For general errors, keep polling for a few retries maybe, 
            // but for now let's mark as failed to satisfy user requirement
            activeRuns.delete(runId)
            setAgents(prev => prev.map(a => a.runId === runId ? { ...a, status: 'FAILED' } : a))
            break
          }
          
          // Wait 2 seconds before next poll
          await new Promise(resolve => setTimeout(resolve, 2000))
        }
      })

      await Promise.allSettled(pollers)
      
      if (!controller.signal.aborted) {
        setStatus('complete')
        setProgressPct(100)
      }

    } catch (err: any) {
      if (err.name === 'AbortError') return
      setStatus('error')
      setError(err.message || 'Deal hunt failed')
    }
  }, [stopStream])

  return {
    status, streams, activeStreamId, setActiveStreamId, agents,
    progressPct, statusMsg,
    elapsedMs, sourcesCount, dealsFound, runId,
    result, error, isAnyAgentRunning, isInitialLoading,
    startStream, stopStream,
  }
}


// ─── Result mapper ───────────────────────────────────────────────
// Maps raw TinyFish result to your SearchResult type

function mapResult(raw: any): SearchResult {
  if (!raw) return { flights: [], trains: [], buses: [], hotels: [] }

  return {
    flights: Array.isArray(raw.flights)
      ? raw.flights.map((f: any, i: number) => mapFlightResult(f, i))
      : [],
    trains : Array.isArray(raw.trains)
      ? raw.trains.map((t: any, i: number) => mapTrainResult(t, i))
      : [],
    buses  : Array.isArray(raw.buses)
      ? raw.buses.map((b: any, i: number) => mapBusResult(b, i))
      : [],
    hotels : Array.isArray(raw.hotels)
      ? raw.hotels.map((h: any, i: number) => mapHotelResult(h, i))
      : [],
  }
}

function countDeals(result: SearchResult): number {
  return (
    result.flights.length +
    result.trains.length  +
    result.buses.length   +
    result.hotels.length
  )
}

function mergeUnique<T extends { id: string }>(existing: T[], incoming: T[]): T[] {
  const seen = new Set(existing.map(e => e.id))
  return [...existing, ...incoming.filter(i => !seen.has(i.id))]
}
