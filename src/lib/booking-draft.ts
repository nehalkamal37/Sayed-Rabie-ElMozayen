"use client";

import { useMemo, useSyncExternalStore } from "react";
import type { BookingDetails } from "./booking";

/** What the visitor has entered so far. Raw values, so either language can format them. */
export interface BookingDraft extends BookingDetails {
  readonly branch: string;
  readonly service: string;
  /** Part of the day chosen in the booking sheet; the booking page asks for an exact time. */
  readonly period: string;
}

const emptyDraft: BookingDraft = {
  branch: "",
  service: "",
  period: "",
  date: "",
  time: "",
  name: "",
  mobile: "",
};

/**
 * Switching language loads a new document, so the draft lives in sessionStorage:
 * it survives the switch, stays in this tab and never reaches a URL or server.
 */
const KEY = "sayed-rabie-booking-draft";
const listeners = new Set<() => void>();
let memory = "";

function read(): string {
  try {
    return window.sessionStorage.getItem(KEY) ?? memory;
  } catch {
    return memory;
  }
}

function write(value: string): void {
  memory = value;
  try {
    window.sessionStorage.setItem(KEY, value);
  } catch {
    // Storage is blocked; the in-memory copy still works on this page.
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  // Pages restored with the Back button re-read what the other language saved.
  window.addEventListener("pageshow", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("pageshow", listener);
  };
}

function parse(raw: string): BookingDraft {
  if (!raw) return emptyDraft;
  try {
    const stored = JSON.parse(raw) as Partial<Record<keyof BookingDraft, unknown>>;
    const text = (key: keyof BookingDraft) => {
      const value = stored[key];
      return typeof value === "string" ? value : "";
    };
    return {
      branch: text("branch"),
      service: text("service"),
      period: text("period"),
      date: text("date"),
      time: text("time"),
      name: text("name"),
      mobile: text("mobile"),
    };
  } catch {
    return emptyDraft;
  }
}

export function updateDraft(patch: Partial<BookingDraft>): void {
  write(JSON.stringify({ ...parse(read()), ...patch }));
}

export function useBookingDraft(): BookingDraft {
  const raw = useSyncExternalStore(subscribe, read, () => "");
  return useMemo(() => parse(raw), [raw]);
}
