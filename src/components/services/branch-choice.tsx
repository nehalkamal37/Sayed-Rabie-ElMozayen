"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { Dictionary } from "@/content";
import { branches, getBranch, parseBranchId, type BranchId } from "@/data/branches";
import type { ServiceId } from "@/data/services";
import type { Locale } from "@/i18n/config";
import { fill } from "@/lib/text";
import { BookingLink } from "../booking/booking-provider";

const BranchChoice = createContext<{
  branch: BranchId | undefined;
  choose: (branch: BranchId | undefined) => void;
}>({ branch: undefined, choose: () => {} });

/** The branch picked on the services page, shared by its filters and Book buttons. */
export function BranchChoiceProvider({ children }: { children: ReactNode }) {
  const [branch, choose] = useState<BranchId>();
  return <BranchChoice value={{ branch, choose }}>{children}</BranchChoice>;
}

interface SelectProps {
  readonly locale: Locale;
  readonly copy: Dictionary["services"];
  readonly label: string;
  readonly className?: string;
  readonly statusClassName?: string;
}

/**
 * Availability per branch is not confirmed, so the list stays whole and says so.
 * The choice does carry into every Book button.
 */
export function BranchChoiceSelect({ locale, copy, label, className, statusClassName }: SelectProps) {
  const { branch, choose } = useContext(BranchChoice);
  return (
    <>
      <label className={className}>
        {label}
        <select
          value={branch ?? ""}
          onChange={(event) => choose(parseBranchId(event.target.value) ?? undefined)}
        >
          <option value="">{copy.allBranches}</option>
          {branches.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name[locale]}
            </option>
          ))}
        </select>
      </label>
      <p className={statusClassName} role="status">
        {branch ? fill(copy.filterPending, { branch: getBranch(branch).name[locale] }) : null}
      </p>
    </>
  );
}

interface BookProps {
  readonly service: ServiceId;
  readonly className?: string;
  readonly children: ReactNode;
}

export function ServiceBookLink({ service, className, children }: BookProps) {
  const { branch } = useContext(BranchChoice);
  return (
    <BookingLink className={className} preset={{ service, branch }}>
      {children}
    </BookingLink>
  );
}
