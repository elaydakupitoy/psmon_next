"use client"

import React, { useEffect, useState } from "react"
import CircularGauge from "./CircularGuage"

type Props = {
  name: string
  percent: number | null
  volume: string
  time: string
  alert?: boolean
  wsUrl?: string
}

export default function PSCard({
  name,
  percent,
  volume,
  time,
  alert,
  wsUrl
}: Props) {
  const [currentPercent, setCurrentPercent] = useState<number | null>(percent)

  useEffect(() => {
    setCurrentPercent(percent)
  }, [percent])

  useEffect(() => {
    if (!wsUrl) return

    const ws = new WebSocket(wsUrl)

    ws.onmessage = (ev) => {
      try {
        const data = JSON.parse(ev.data)
        const p = data.percent ?? data.value ?? null
        if (typeof p === "number") setCurrentPercent(p)
      } catch (err) {
        const v = Number(ev.data)
        if (!Number.isNaN(v)) setCurrentPercent(v)
      }
    }

    ws.onerror = () => {
      // Browser WS error events are opaque; details usually surface in `onclose`.
      console.warn("WebSocket error event", { wsUrl, readyState: ws.readyState })
    }

    ws.onclose = (event) => {
      console.warn("WebSocket closed", {
        wsUrl,
        code: event.code,
        reason: event.reason || "(empty)",
        wasClean: event.wasClean
      })
    }

    return () => {
      try {
        ws.close()
      } catch (e) {
      }
    }
  }, [wsUrl])

  return (
    <div className="bg-white rounded-lg border p-4 text-center w-64">
      <h3 className="font-semibold mb-2">{name}</h3>

      <CircularGauge value={currentPercent} color={alert ? "#e11d48" : "#000"} />

      <div className="mt-3 text-sm text-gray-600 border rounded p-2">
        🧊 {volume} &nbsp; • &nbsp; ⏱ {time}
      </div>
    </div>
  )
}
