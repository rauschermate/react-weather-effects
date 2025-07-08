"use client"

import RainEffect from "./RainEffect";
import React, { useState } from "react";

const RAIN_TYPES = [
  { type: "rain", label: "Rain" },
  { type: "storm", label: "Storm" },
  { type: "drizzle", label: "Drizzle" },
  { type: "fallout", label: "Fallout" },
];

const BG_IMAGE = "https://images.unsplash.com/photo-1541343672885-9be56236302a?q=80&w=1587&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

export default function RainPage() {
  const [rainType, setRainType] = useState("rain");

  return (
    <>
      <RainEffect backgroundImageUrl={BG_IMAGE} type={rainType} />
      <div
        className="fixed bottom-8 left-1/2 z-50 -translate-x-1/2 flex items-center justify-center px-6 py-3 rounded-2xl shadow-xl backdrop-blur-md bg-white/20 border border-white/30"
        style={{
          background: "rgba(60,53,47,0.65)",
          boxShadow: "0 8px 32px 0 rgba(255, 255, 255, 0.17)",
          border: "1px solid rgba(255,255,255,0.18)",
          backdropFilter: "blur(12px)",
        }}
      >
        {RAIN_TYPES.map(({ type, label }) => (
          <button
            key={type}
            onClick={() => setRainType(type)}
            className={`mx-2 px-4 py-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-zinc-400/40
              ${rainType === type ? "bg-white/20 text-white shadow-md scale-105" : " text-zinc-400 hover:text-white"}`}
            style={{
              border: rainType === type ? "1px solid rgba(255,255,255,0.2)" : "1px solid transparent",
              boxShadow: rainType === type ? "0 2px 8px 0 rgba(96,165,250,0.12)" : undefined,
              minWidth: 72,
            }}
          >
            {label}
          </button>
        ))}
      </div>
    </>
  );
}   