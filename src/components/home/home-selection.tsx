"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { ServiceId } from "@/data/services";

interface Selection {
  readonly service: ServiceId;
  /** False until the visitor picks a service themselves. */
  readonly chosen: boolean;
}

interface SelectionContext extends Selection {
  readonly choose: (service: ServiceId) => void;
}

const Context = createContext<SelectionContext | null>(null);

export function useHomeSelection(): SelectionContext {
  const value = useContext(Context);
  if (!value) throw new Error("useHomeSelection needs HomeSelection");
  return value;
}

/** Shares the service highlighted in the menu with the phone booking bar. */
export function HomeSelection({ first, children }: { first: ServiceId; children: ReactNode }) {
  const [selection, setSelection] = useState<Selection>({ service: first, chosen: false });
  const choose = (service: ServiceId) => setSelection({ service, chosen: true });
  return <Context value={{ ...selection, choose }}>{children}</Context>;
}
