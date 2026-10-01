"use client";
import { createContext, useContext, useEffect, useState } from "react";

export type CardMode = "live" | "render" | "print" | "thumb" | "editor";

export interface CardEnvValue {
  mode: CardMode;
  /** frozen clock for deterministic renders (ms since epoch) */
  now?: number;
  guest?: string;
  onRsvp?: () => void;
}

const Ctx = createContext<CardEnvValue>({ mode: "live" });

export const CardEnvProvider = Ctx.Provider;
export const useCardEnv = () => useContext(Ctx);

/** Ticking clock in live mode; a fixed instant in render/print/thumb modes. */
export function useNow(intervalMs = 1000) {
  const env = useCardEnv();
  const frozen = env.mode !== "live" && env.mode !== "editor";
  const [now, setNow] = useState<number>(() => env.now ?? Date.now());
  useEffect(() => {
    if (frozen) return;
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [frozen, intervalMs]);
  return frozen ? env.now ?? now : now;
}
