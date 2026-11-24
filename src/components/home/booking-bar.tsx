"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import type { Dictionary } from "@/content";
import { bookingBranchName, branches, parseBranchId } from "@/data/branches";
import { parseServiceId, services } from "@/data/services";
import type { Locale } from "@/i18n/config";
import { addDays, cairoNow, parseTimePeriod, timePeriods } from "@/lib/booking";
import { useBooking } from "../booking/booking-provider";
import { Icon } from "../icons";
import styles from "./booking-bar.module.css";

interface Props {
  readonly locale: Locale;
  readonly bar: Dictionary["home"]["bar"];
  readonly booking: Dictionary["booking"];
}

/** Desktop shortcut: its choices carry into the booking panel, which asks for contact details. */
export function BookingBar({ locale, bar, booking }: Props) {
  const { open } = useBooking();
  const { sheet, fields } = booking;
  const [choice, setChoice] = useState({ branch: "", service: "", day: "0", period: "evening" });
  const set = (key: keyof typeof choice) => (value: string) =>
    setChoice((current) => ({ ...current, [key]: value }));

  function submit(event: FormEvent) {
    event.preventDefault();
    open({
      branch: parseBranchId(choice.branch) ?? undefined,
      service: parseServiceId(choice.service) ?? undefined,
      date: addDays(cairoNow().date, Number(choice.day)),
      period: parseTimePeriod(choice.period) ?? undefined,
    });
  }

  return (
    <form className={styles.bar} aria-label={bar.label} onSubmit={submit}>
      <Choice label={fields.branch} value={choice.branch} onChange={set("branch")} wide>
        <option value="">{sheet.chooseBranch}</option>
        {branches.map((branch) => (
          <option key={branch.id} value={branch.id}>
            {bookingBranchName(branch)[locale]}
          </option>
        ))}
      </Choice>
      <Choice label={fields.service} value={choice.service} onChange={set("service")} wide>
        <option value="">{sheet.chooseService}</option>
        {services.map((service) => (
          <option key={service.id} value={service.id}>
            {service.name[locale]}
          </option>
        ))}
      </Choice>
      <Choice label={sheet.day} value={choice.day} onChange={set("day")}>
        <option value="0">{sheet.today}</option>
        <option value="1">{sheet.tomorrow}</option>
      </Choice>
      <Choice label={sheet.time} value={choice.period} onChange={set("period")}>
        {timePeriods.map((period) => (
          <option key={period} value={period}>
            {sheet.periods[period]}
          </option>
        ))}
      </Choice>
      <button type="submit" className={styles.submit} aria-haspopup="dialog">
        {bar.submit}
      </button>
      <p className={styles.note}>
        <Icon name="info" size={16} className={styles.info} />
        {bar.note}
      </p>
    </form>
  );
}

interface ChoiceProps {
  readonly label: string;
  readonly value: string;
  readonly wide?: boolean;
  readonly onChange: (value: string) => void;
  readonly children: ReactNode;
}

function Choice({ label, value, wide, onChange, children }: ChoiceProps) {
  return (
    <label className={styles.choice} data-wide={wide || undefined}>
      {label}
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {children}
      </select>
    </label>
  );
}
