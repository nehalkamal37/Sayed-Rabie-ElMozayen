"use client";

import Link from "next/link";
import {
  createContext,
  useContext,
  useState,
  type ComponentProps,
  type MouseEvent,
  type ReactNode,
} from "react";
import type { Dictionary } from "@/content";
import { localePath, type Locale } from "@/i18n/config";
import type { TimePeriod } from "@/lib/booking";
import { bookingPath, type BookingPreset } from "@/lib/paths";
import { BookingPanel } from "./booking-panel";

export interface PanelPreset extends BookingPreset {
  /** YYYY-MM-DD */
  readonly date?: string;
  readonly period?: TimePeriod;
}

interface BookingContextValue {
  readonly locale: Locale;
  readonly open: (preset: PanelPreset) => void;
}

const BookingContext = createContext<BookingContextValue | null>(null);

export function useBooking(): BookingContextValue {
  const value = useContext(BookingContext);
  if (!value) throw new Error("useBooking needs a BookingProvider");
  return value;
}

interface ProviderProps {
  readonly locale: Locale;
  readonly copy: Dictionary["booking"];
  readonly children: ReactNode;
}

/** Holds the one booking sheet (phones) or side panel (desktop) for the page. */
export function BookingProvider({ locale, copy, children }: ProviderProps) {
  // Each opening is its own panel, so one can open while another is still closing.
  const [panel, setPanel] = useState<{ id: number; preset: PanelPreset } | null>(null);
  const open = (preset: PanelPreset) =>
    setPanel((current) => ({ id: (current?.id ?? 0) + 1, preset }));
  return (
    <BookingContext value={{ locale, open }}>
      {children}
      {panel ? (
        <BookingPanel
          key={panel.id}
          locale={locale}
          copy={copy}
          preset={panel.preset}
          onClose={() => setPanel((current) => (current?.id === panel.id ? null : current))}
        />
      ) : null}
    </BookingContext>
  );
}

interface LinkProps extends Omit<ComponentProps<typeof Link>, "href" | "onClick"> {
  readonly preset?: BookingPreset;
}

/**
 * Opens the booking panel with the given choices. It is a real link to the
 * booking page, so it still works in a new tab or without JavaScript.
 */
export function BookingLink({ preset = {}, children, ...rest }: LinkProps) {
  const { locale, open } = useBooking();

  function openPanel(event: MouseEvent) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    open(preset);
  }

  return (
    <Link
      {...rest}
      href={localePath(locale, bookingPath(preset))}
      prefetch={false}
      aria-haspopup="dialog"
      onClick={openPanel}
    >
      {children}
    </Link>
  );
}
