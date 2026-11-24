import { useState, type FormEvent } from "react";
import { serviceGroups, servicesInGroup, type ServiceId } from "@/data/services";
import type { Locale } from "@/i18n/config";
import type { BookingCopy } from "./booking-flow";
import styles from "./booking-flow.module.css";
import { OptionGroup } from "./option-group";

interface Props {
  readonly locale: Locale;
  readonly copy: BookingCopy;
  readonly selected: ServiceId | null;
  readonly onSelect: (id: ServiceId) => void;
  readonly onBack: () => void;
  readonly onContinue: () => void;
}

export function ServiceStep({ locale, copy, selected, onSelect, onBack, onContinue }: Props) {
  const [attempted, setAttempted] = useState(false);
  const invalid = attempted && !selected;

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (selected) return onContinue();
    setAttempted(true);
    event.currentTarget.querySelector<HTMLInputElement>("input[type=radio]")?.focus();
  }

  const sections = serviceGroups.map((group) => ({
    key: group.id,
    title: group.name[locale],
    options: servicesInGroup(group.id).map((service) => ({
      id: service.id,
      label: service.name[locale],
      hint: service.note?.[locale],
    })),
  }));

  return (
    <form noValidate onSubmit={submit}>
      <p className={styles.note}>{copy.serviceNote}</p>
      <OptionGroup
        name="service"
        labelledBy="step-heading"
        sections={sections}
        selected={selected}
        onSelect={onSelect}
        errorId={invalid ? "service-error" : undefined}
      />
      <div role="alert">
        {invalid ? (
          <p id="service-error" className={styles.error}>
            {copy.errors.service}
          </p>
        ) : null}
      </div>
      <div className={styles.actions}>
        <button type="submit" className="button button--dark">
          {copy.continue}
        </button>
        <button type="button" className="button button--outline" onClick={onBack}>
          {copy.back}
        </button>
      </div>
    </form>
  );
}
