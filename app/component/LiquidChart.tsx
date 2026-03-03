 "use client";

import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { interpolateRgb } from "d3-interpolate";
import { color } from "d3-color";
import RelativeTime from "./RelativeTime";

const LiquidFillGauge = dynamic(() => import("react-liquid-gauge"), {
  ssr: false,
});

interface LiquidGaugeProps {
  id: number;
  title?: string;
  wsUrl?: string;   // 👈 NEW
}

interface SensorData {
  id: number;
  type_ID: number;
  par1: number;
  par2: number;
  par3: string;
  par4: number | null;
  status: number;
}

const LiquidGauge: React.FC<LiquidGaugeProps> = ({ id, title, wsUrl }) => {
  const [sensorData, setSensorData] = useState<SensorData>({
    id: 0,
    type_ID: 0,
    par1: 15,
    par2: 0,
    par3: "ft",
    par4: 0,
    status: 0,
  });

  const [value, setValue] = useState<number>(0);
  const [timestamp, setTimestamp] = useState<string>("");

  const [gradientStops, setGradientStops] = useState<any[]>([]);

  const wsRef = useRef<WebSocket | null>(null);

  const radius = 100;
  const startColor = "#dc143c";
  const endColor = "#6495ed";

  // ✅ Fetch sensor config ONCE
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch(`/api/sensor/data/${id}`);
        const data: SensorData = await response.json();
       /*  console.log("Fetched sensor config:", data); */
        setSensorData({
  ...data,
  par1: Number(data.par1),
  par2: Number(data.par2),
  par4: data.par4 !== null ? Number(data.par4) : null,
});
      } catch (err) {
        console.error("Config fetch error:", err);
      }
    };

    if (id) fetchConfig();
  }, [id]);

  // ✅ WebSocket Effect
  useEffect(() => {
    if (!wsUrl || !sensorData.par1) return;

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connected:", wsUrl);
    };

    ws.onmessage = (ev) => {
      try {
        const data = JSON.parse(ev.data);

        const rawValue =
          data.value1 ?? data.value ?? data.percent ?? null;
       const fullValue =
  typeof sensorData.par4 === "number" && sensorData.par4 > 0
    ? sensorData.par4
    : 100;
        

        if (typeof rawValue === "number") {
        /*   const computed =
            100 -
            (100 *
              (sensorData.par1 * 62.42303990511698 - rawValue)) /
              (sensorData.par1 * 62.42303990511698); */

const computed = (rawValue / fullValue) * 100;

          setValue(computed);
          setTimestamp(data.timestamp ?? new Date().toISOString());
           
        }
      } catch {
        const numeric = Number(ev.data);
        if (!Number.isNaN(numeric)) {
          setValue(numeric);
        }
      }
    };

    ws.onerror = () => {
      console.warn("WebSocket error", {
        wsUrl,
        readyState: ws.readyState,
      });
    };

    ws.onclose = (event) => {
      console.warn("WebSocket closed", {
        wsUrl,
        code: event.code,
        reason: event.reason || "(empty)",
        wasClean: event.wasClean,
      });
    };

    // ✅ Cleanup
    return () => {
      ws.close();
    };
 }, [wsUrl, sensorData.par4]); // 👈 only reconnect if these change

  // ✅ Update gradient when value changes
  useEffect(() => {
    const interpolate = interpolateRgb(startColor, endColor);
    const fillColor = interpolate(value / 100);

    setGradientStops([
      {
        key: "0%",
        stopColor: color(fillColor).darker(0.5).toString(),
        stopOpacity: 1,
        offset: "0%",
      },
      {
        key: "50%",
        stopColor: fillColor,
        stopOpacity: 0.75,
        offset: "50%",
      },
      {
        key: "100%",
        stopColor: color(fillColor).brighter(0.5).toString(),
        stopOpacity: 0.5,
        offset: "100%",
      },
    ]);
  }, [value]);

  const interpolate = interpolateRgb(startColor, endColor);
  const fillColor = interpolate(value / 100);

 

  return (
    <div  style={{
    border: "1px solid #007bff",
    borderRadius: "8px",
    padding: "30px",
  }}>



      {title && (
  <div style={{ fontSize: "1em", textAlign: "center" }}>
    {title}
  </div >
)}
      <LiquidFillGauge
        style={{ margin: "0 auto" }}
        width={radius * 2}
        height={radius * 2}
        value={value}
        percent="%"
        textSize={1}
        riseAnimation
        waveAnimation
        waveFrequency={2}
        waveAmplitude={1}
        gradient
        gradientStops={gradientStops}
        circleStyle={{ fill: fillColor }}
        waveStyle={{ fill: fillColor }}
        textStyle={{
          fill: color("#444").toString(),
          fontFamily: "Arial",
        }}
        waveTextStyle={{
          fill: color("#fff").toString(),
          fontFamily: "Arial",
        }}
      />
 
      <div className="alert alert-light mt-2">
       
        <div
  className="alert alert-light mt-2"
  role="alert"
  style={{
    border: "1px solid #64686d",
    borderRadius: "8px",
    padding: "10px",
  }}
>
        <span
  className="tank-span"
  style={{ display: "inline-block", verticalAlign: "middle", lineHeight: 0 }}
>
  <svg
    width="16"
    height="24"
    viewBox="0 0 16 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ display: "block" }}
  >
    {/* Cylinder body */}
    <rect
      x="3"
      y="4"
      width="10"
      height="16"
      rx="5"
      ry="5"
      stroke="#000"
      strokeWidth="1"
      fill="#cce5ff"
    />
    {/* Top ellipse */}
    <ellipse
      cx="8"
      cy="4"
      rx="5"
      ry="2"
      fill="#99ccff"
      stroke="#000"
      strokeWidth="1"
    />
  </svg>
</span>

<span className="tooltip2" data-tooltip="Current Load">
  102
</span>
        &nbsp;/&nbsp;
        <span className="tooltip2" data-tooltip="Capacity">
        {/*  {capacity} */} 500 m³ :&nbsp;
        </span>
      <span className="timer-span" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="16" 
    height="16" 
    fill="currentColor" 
    viewBox="0 0 16 16"
    style={{ display: "inline-block", verticalAlign: "middle" }}
  >
    <path d="M8 3.5a.5.5 0 0 1 .5.5v4.25l3 1.75a.5.5 0 1 1-.5.866l-3.5-2A.5.5 0 0 1 7.5 8V4a.5.5 0 0 1 .5-.5z"/>
    <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm0-1A7 7 0 1 1 8 1a7 7 0 0 1 0 14z"/>
  </svg>
  <RelativeTime timestamp={timestamp} />
</span>
        </div>
         
      </div>
      

      

      
    </div>
  );
};

export default LiquidGauge;